import { reactive, markRaw, type Component } from 'vue'
import type { ModalContract } from './contract'
import type { ModalProps } from './props'
import { modalRegistry } from './registry'

const state = reactive({
  stack: [] as Array<{
    id: number
    component: Component
    props: ModalProps
    resolve: (value: boolean | null) => void
  }>,
})

export const modalService = {
  open(payload: ModalContract): Promise<boolean | null> {
    const { type, ...props } = payload
    const component = modalRegistry[type]

    return new Promise((resolve) => {
      state.stack.push({
        id: Date.now(),
        component: markRaw(component),
        props,
        resolve,
      })
    })
  },

  close(id: number, result: boolean | null) {
    const index = state.stack.findIndex((m) => m.id === id)
    if (index !== -1) {
      const modal = state.stack[index]
      if (!modal) return
      modal.resolve(result)
      state.stack.splice(index, 1)
    }
  },

  get stack() {
    return state.stack
  },
}
