import { test, expect } from '@playwright/test'
import { setConfig } from '@e2e/utils/test-helpers'

test('it has terms section', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('terms-link')).toBeVisible()
  await page.getByTestId('terms-link').click()
  await expect(page).toHaveURL('/terms')

  await expect(page).toHaveScreenshot('terms-page.png')
})

test.describe('home page without active game', () => {
  test('it shows home page', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('active-game-ticket')).not.toBeVisible()
    await page.getByTestId('new-game-button').click()

    await expect(page).toHaveScreenshot('home-page.png')

    await expect(page).toHaveURL('/game/players')
  })
})

test.describe('home page with active game', () => {
  const mockSettings = {
    hasActiveGame: true,
    players: [
      { "id": "1", "name": "Andrii", "order": 0, "color": "#0072B2" },
      { "id": "2", "name": "Batman", "order": 1, "color": "#04080bff" },
      { "id": "3", "name": "Superman", "order": 2, "color": "#f12800ff" },
    ],
    suggestions: [
      { "playerId": "1", "character": "Miss Scarlet", "weapon": "Candlestick", "room": "Library" },
      { "playerId": "2", "character": "Professor Plum", "weapon": "Revolver", "room": "Kitchen" },
    ],
  }

  test.beforeEach(async ({ page }) => {
    await setConfig(page, 'settings', mockSettings)
  })

  test('it continues active game when clicked', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('active-game-ticket')).toBeVisible()

    await expect(page).toHaveScreenshot('game-in-progress.png')

    await page.getByTestId('active-game-ticket').click()
    await expect(page).toHaveURL('/game/play')
  })

  test('it confirms new game', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('new-game-button').click()
    await page.getByRole('dialog').getByText('Start a New Game?')

    await expect(page).toHaveScreenshot('game-in-progress-confirmation-page.png')

    await page.getByTestId('modal-confirmation-confirm-button').click()
    await expect(page).toHaveURL('/game/players')
  })

  test('it cancels new game', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('new-game-button').click()
    await page.getByTestId('modal-confirmation-cancel-button').click()
    await expect(page.getByRole('dialog')).toBeHidden()
    await expect(page.getByTestId('active-game-ticket')).toBeVisible()
    await expect(page).toHaveURL('/')
  })
})