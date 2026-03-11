import { reactive } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export interface Player {
  id: string
  name: string
  order: number
  color: string
}

export function createPlayer(name: string, order: number): Player {
  const colors = ['#0072B2', '#D55E00', '#006E73', '#6A1B9A', '#37474F', '#C2185B']
  return reactive({
    id: uuidv4(),
    name,
    order,
    color: colors[order % colors.length] ?? colors[0]!,
  })
}
