import { type Component } from 'vue'

export interface InformationModalProps {
  title: string
  body?: string | Component
  confirmButtonText?: string
}

export interface ConfirmationModalProps {
  title: string
  body: string
  confirmButtonText?: string
  cancelButtonText?: string
  canClose?: boolean
}

export type ModalProps = InformationModalProps | ConfirmationModalProps
