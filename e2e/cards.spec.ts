import { test, expect } from '@playwright/test'
import { setConfig } from '@e2e/utils/test-helpers'

test('it shows cards page', async ({ page }) => {
  await page.goto('/game/setup-cards')
  await expect(page.getByTestId('game-setup-cards-view')).toBeVisible()

  await expect(page).toHaveScreenshot('setup-cards-page.png')
})

test('it allows select a card', async ({ page }) => {
  await page.goto('/game/setup-cards')
  await expect(page.getByTestId('game-setup-cards-view')).toBeVisible()
  await page.getByTestId('card-slot').nth(0).click()
  await page.getByRole('button', { name: 'Miss Scarlett' }).click()

  await expect(page).toHaveScreenshot('select-card-modal.png')
})

test('it allows quick fill', async ({ page }) => {
  await page.goto('/game/setup-cards')
  await expect(page.getByTestId('game-setup-cards-view')).toBeVisible()
  await page.getByTestId('cards-continue-button').click()
  await expect(page.getByTestId('shared-card-picker')).toBeVisible()
  await page.getByTestId('card-chip-suspect-miss-scarlett').click()
  await page.getByTestId('card-chip-suspect-mr-green').click()
  await page.getByTestId('card-chip-weapon-revolver').click()

  await expect(page).toHaveScreenshot('qukck-fill-modal.png')

  await page.getByTestId('card-chip-weapon-candlestick').click()
  await expect(page.getByTestId('shared-card-picker')).not.toBeVisible()
  await page.getByTestId('cards-continue-button').click()
  await expect(page).toHaveURL('/game/play')
})

test.describe('with selected', () => {
  test('it shows three cards', async ({ page }) => {
    await setConfig(page, 'notebook', {
      myCardsIds: [
        "suspect-miss-scarlett",
        "weapon-candlestick",
        "room-conservatory",
      ]
    })
    page.on('console', msg => console.log('Browser console:', msg.text()))

    await page.goto('/game/setup-cards?edit=2')
    await expect(page.getByTestId('game-setup-cards-view')).toBeVisible()
    await expect(page.getByTestId('card-slot')).toHaveCount(3)

    await expect(page).toHaveScreenshot('three-cards-selected.png')

    await page.getByTestId('remove-card-button').first().click()

    await expect(page).toHaveScreenshot('two-cards-selected-one-deleted.png')
  })

  test('it shows frour cards', async ({ page }) => {
    setConfig(page, 'notebook', {
      myCardsIds: [
        "suspect-miss-scarlett",
        "weapon-candlestick",
        "room-conservatory",
        "suspect-colonel-mustard",
      ]
    })
    await page.goto('/game/setup-cards?edit=1')
    await expect(page.getByTestId('game-setup-cards-view')).toBeVisible()
    await expect(page.getByTestId('card-slot')).toHaveCount(4)

    await expect(page).toHaveScreenshot('four-cards-selected.png')

    await page.getByTestId('show-card-button').first().click()
    await expect(page.getByTestId('big-card-image-modal')).toBeVisible()

    await expect(page).toHaveScreenshot('big-card-image-modal.png')
  })

  test('it shows five cards', async ({ page }) => {
    setConfig(page, 'notebook', {
      myCardsIds: [
        "suspect-miss-scarlett",
        "weapon-candlestick",
        "room-conservatory",
        "suspect-colonel-mustard",
        "suspect-dr-orchid",
      ]
    })
    await page.goto('/game/setup-cards?edit=1')
    await expect(page.getByTestId('game-setup-cards-view')).toBeVisible()
    await expect(page.getByTestId('card-slot')).toHaveCount(5)

    await expect(page).toHaveScreenshot('five-cards-selected.png')
  })

  test('it shows six cards', async ({ page }) => {
    setConfig(page, 'notebook', {
      myCardsIds: [
        "suspect-miss-scarlett",
        "weapon-candlestick",
        "room-conservatory",
        "suspect-colonel-mustard",
        "suspect-dr-orchid",
        "weapon-revolver",
      ]
    })
    await page.goto('/game/setup-cards?edit=1')
    await expect(page.getByTestId('game-setup-cards-view')).toBeVisible()
    await expect(page.getByTestId('card-slot')).toHaveCount(6)

    await expect(page).toHaveScreenshot('six-cards-selected.png')
  })
})