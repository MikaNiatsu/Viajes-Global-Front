import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Cliente } from '@/types/objects'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<Cliente | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('auth_token')
      if (token) {
        try {
          // Verificar el token con el servidor
          const response = await fetch('/api/check-auth', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          if (response.ok) {
            setIsAuthenticated(true)
          } else {
            // Si el token no es válido, lo eliminamos
            localStorage.removeItem('auth_token')
            setIsAuthenticated(false)
          }
        } catch (error) {
          console.error('Error checking authentication:', error)
          setIsAuthenticated(false)
        }
      } else {
        setIsAuthenticated(false)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])


  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('auth_token', data.token)
        setIsAuthenticated(true)
        setUser(data.user)
        router.push('/')
      } else {
        throw new Error('Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      // Manejar error de inicio de sesión
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('auth_token')
      setIsAuthenticated(false)
      router.push('/')
    }
  }

  return { isAuthenticated, isLoading, login, logout, user }
}
