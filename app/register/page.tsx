'use client'
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useRouter } from 'next/navigation'


export default function RegisterPage() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const router = useRouter()


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      alert('Account created successfully!')
      router.push('/login') // redirect to login after signup
    } catch (error: any) {
      alert(error.message)
    }
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50s0">
      <h1 className="text-xl font-bold mb-4">Register</h1>
      <form onSubmit={handleRegister} className="space-y-4 w-64">
        <input type="email" placeholder="Email" className="w-full border p-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full border p-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-green-500 text-white p-2 rounded" type="submit">Sign Up</button>
      </form>
      <button
        className="mt-4 text-sm text-blue-600"
        onClick={() => router.push('/login')} // redirect to login page
      >
        Already have an account? Login
      </button>
    </div>
  )
}
