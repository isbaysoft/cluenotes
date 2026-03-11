import { type Page } from '@playwright/test'

export const setConfig = (page: Page, itemName: string, item: object) => {
  return page.addInitScript((state: { item: object; itemName: string }) => {
    window.localStorage.setItem(state.itemName, JSON.stringify(state.item))
  }, { item, itemName })
}
