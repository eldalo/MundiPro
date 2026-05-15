import { useEffect } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('dark')
    root.classList.add('light')
    root.style.colorScheme = 'light'
    try {
      localStorage.removeItem('mundipro-theme')
    } catch {
      // ignore
    }
  }, [])

  return <>{children}</>
}
