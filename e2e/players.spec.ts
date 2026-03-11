import { test, expect } from '@playwright/test'
import { setConfig } from '@e2e/utils/test-helpers'

test('it shows default four players', async ({ page }) => {
  await page.goto('/game/players')
  await page.getByTestId('player-list-container')

  await expect(page).toHaveScreenshot('four-players.png')
})

test('it edits second player', async ({ page }) => {
  await page.goto('/game/players')
  await page.getByTestId('player-list-container')

  await page.getByTestId('player-name-input').nth(1).focus()

  await expect(page).toHaveScreenshot('edit-second-player.png')
})

test('it shows maximum allowed players', async ({ page }) => {
  const mockSettings = {
    players: [
      { "id": "1", "name": "Andrii", "order": 0, "color": "#0072B2" },
      { "id": "2", "name": "BatmanLongLongStoryName", "order": 1, "color": "#04080bff" },
      { "id": "3", "name": "Superman", "order": 2, "color": "#f12800ff" },
      { "id": "4", "name": "Aquaman", "order": 3, "color": "#857df0ff" },
      { "id": "5", "name": "Wonder", "order": 4, "color": "#7a8707ff" },
      { "id": "6", "name": "Flash", "order": 5, "color": "#676673ff" }
    ]
  }
  await setConfig(page, 'settings', mockSettings)

  await page.goto('/game/players')
  await page.getByTestId('player-list-container')

  await expect(page).toHaveScreenshot('six-players.png')
})

test('it shows insufficient players', async ({ page }) => {
  const mockSettings = {
    players: [
      { "id": "1", "name": "Andrii", "order": 0, "color": "#0072B2" },
      { "id": "6", "name": "Flash", "order": 5, "color": "#676673ff" }
    ]
  }
  await setConfig(page, 'settings', mockSettings)

  await page.goto('/game/players')
  await page.getByTestId('player-list-container')

  await expect(page).toHaveScreenshot('two-players.png')
})