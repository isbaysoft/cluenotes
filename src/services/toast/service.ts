import { ref } from 'vue'
import { type ToastProps } from './props'
import { v4 as uuidv4 } from 'uuid'

type ToastItem = ToastProps & { id: string }

const stack = ref<Array<ToastItem>>([])

const close = (id: string) => {
  stack.value = stack.value.filter((toast) => toast.id !== id)
}

const closeAll = () => {
  stack.value.forEach((toast) => {
    close(toast.id)
  })
}

const add = (options: Omit<ToastProps, 'id'>): Promise<boolean> => {
  const id = uuidv4()
  stack.value.push({ id, ...options })
  setTimeout(() => {
    close(id)
  }, 5000)
  return Promise.resolve(true)
}

export const toastService = {
  get stack() {
    return stack.value
  },

  close,
  closeAll,
  add,
}
