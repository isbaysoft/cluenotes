export interface ToastProps {
  id?: string
  title?: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}
