import type { InformationModalProps, ConfirmationModalProps } from './props'

export type ModalContract =
  | ({ type: 'information' } & InformationModalProps)
  | ({ type: 'confirmation' } & ConfirmationModalProps)
