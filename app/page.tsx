'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from './lib/firebase'
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore'
import { signOut, onAuthStateChanged, User } from 'firebase/auth'
import { Task } from './lib/types'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Low',
  })
  const [editingTask, setEditingTask] = useState<Task | null>(null)

    const loadTasks = async (email: string) => {
    const q = query(collection(db, 'tasks'), where('userEmail', '==', email))
    const snapshot = await getDocs(q)
    const tasksList = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Task)
    )
    setTasks(tasksList)
  }
  // 🔒 Protect route + load tasks
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/login')
      } else {
        setUser(currentUser)
        await loadTasks(currentUser.email!)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // 🔁 Fetch user-specific tasks


  // ➕ Add or Update Task
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (editingTask) {
      const ref = doc(db, 'tasks', editingTask.id)
      await updateDoc(ref, {
        title: form.title,
        description: form.description,
        priority: form.priority,
      })
      alert('Task updated!')
      setEditingTask(null)
    } else {
      await addDoc(collection(db, 'tasks'), {
        title: form.title,
        description: form.description,
        priority: form.priority,
        completed: false,
        userEmail: user.email,
      })
      alert('Task added!')
    }

    setForm({ title: '', description: '', priority: 'Low' })
    await loadTasks(user.email!)
  }

  // 🗑️ Delete task
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return
    await deleteDoc(doc(db, 'tasks', id))
    setTasks(tasks.filter((t) => t.id !== id))
  }

  // ✅ Toggle complete
  const toggleComplete = async (task: Task) => {
    const ref = doc(db, 'tasks', task.id)
    await updateDoc(ref, { completed: !task.completed })
    await loadTasks(user!.email!)
  }

  // ✏️ Edit task
  const handleEdit = (task: Task) => {
    setForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
    })
    setEditingTask(task)
  }

  // 🚪 Logout
  const handleLogout = async () => {
    await signOut(auth)
    router.push('/login')
  }

  if (loading) return <p className="text-center mt-10 text-black">Loading...</p>

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6 text-black">
      <div className="flex justify-between w-full max-w-2xl mb-6">
        <h1 className="text-2xl font-bold">
          Hello, {user?.email || 'Guest'} 👋
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow w-full max-w-2xl mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingTask ? 'Edit Task' : 'Add Task'}
        </h2>
        <input
          type="text"
          placeholder="Title"
          className="border p-2 w-full mb-2 text-black"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          className="border p-2 w-full mb-2 text-black"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <select
          className="border p-2 w-full mb-2 text-black"
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          type="submit"
        >
          {editingTask ? 'Update Task' : 'Add Task'}
        </button>
      </form>

      {/* Task List */}
      <div className="w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-2">Your Tasks</h2>
        {tasks.length === 0 && <p>No tasks yet!</p>}
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white p-4 rounded shadow mb-2 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">
                {task.title}{' '}
                <span className="text-sm text-gray-600">({task.priority})</span>
              </h3>
              <p>{task.description}</p>
              <label className="text-sm">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task)}
                  className="mr-2"
                />
                Completed
              </label>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(task)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}