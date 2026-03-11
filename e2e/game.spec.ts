import { test, expect } from '@playwright/test'
import { setConfig } from '@e2e/utils/test-helpers'

test('it shows grid', async ({ page }) => {
  const mockSettings = {
    players: [
      { "id": "1", "name": "Andrii", "order": 0, "color": "#0072B2" },
      { "id": "2", "name": "BatmanLongLongStoryName", "order": 1, "color": "#04080bff" },
      { "id": "3", "name": "Superman", "order": 2, "color": "#f12800ff" },
      { "id": "4", "name": "Aquaman", "order": 3, "color": "#857df0ff" },
      { "id": "5", "name": "Wonder", "order": 4, "color": "#7a8707ff" },
      { "id": "6", "name": "Flash", "order": 5, "color": "#676673ff" }
    ],
    suggestions: [
      {
        accusing: false,
        accustionConfirmed: false,
        askedByPlayerId: "3",
        disprovedByPlayerId: "4",
        nobodyDisproved: false,
        shownCardId: null,
        suspect: { id: 'suspect-mr-green' },
        weapon: { id: 'weapon-revolver ' },
        room: { id: 'room-billiard-room' },
      },
    ]
  }
  setConfig(page, 'settings', mockSettings)

  const mockNotebook = {
    myCardsIds: [
      "suspect-miss-scarlett",
      "weapon-candlestick",
      "room-conservatory",
    ],
    manualOverrides: {
      "2_suspect-dr-orchid": 3,
      "3_suspect-colonel-mustard": 2,
      "2_suspect-mrs-peacock": 1,
      "3_suspect-mrs-peacock": 1,
      "4_suspect-mrs-peacock": 1,
      "5_suspect-mrs-peacock": 1,
      "6_suspect-mrs-peacock": 1,
    }
  }
  setConfig(page, 'notebook', mockNotebook)

  await page.goto('/game/play')
  await expect(page.getByTestId('notebook-table')).toBeVisible()

  await expect(page).toHaveScreenshot('game.png')
})

test('game over', async ({ page }) => {
  const mockSettings = {
    players: [
      { "id": "1", "name": "Andrii", "order": 0, "color": "#0072B2" },
      { "id": "2", "name": "BatmanLongLongStoryName", "order": 1, "color": "#04080bff" },
      { "id": "3", "name": "Superman", "order": 2, "color": "#f12800ff" },
    ],
    suggestions: [
      {
        accusing: true,
        accustionConfirmed: true,
        askedByPlayerId: "2",
        disprovedByPlayerId: "3",
        nobodyDisproved: false,
        room: { id: 'room-billiard-room' },
        shownCardId: null,
        suspect: { id: 'suspect-mr-green' },
        weapon: { id: 'weapon-revolver ' },
      }
    ]
  }
  setConfig(page, 'settings', mockSettings)

  const mockNotebook = {
    myCardsIds: [
      "suspect-miss-scarlett",
      "weapon-candlestick",
      "room-conservatory",
    ],
  }
  setConfig(page, 'notebook', mockNotebook)

  await page.goto('/game/play')
  await expect(page.getByTestId('winner')).toBeVisible()

  await expect(page).toHaveScreenshot('game-over.png')
})

test('it shows game menu', async ({ page }) => {
  await page.goto('/game/play')
  await page.getByTestId('game-menu-button').click()
  await expect(page.getByTestId('game-menu-container')).toBeVisible()

  await expect(page).toHaveScreenshot('game-menu.png')
})

test.describe('suggestion wizzard', () => {
  test.beforeEach(async ({ page }) => {
    const mockSettings = {
      players: [
        { "id": "1", "name": "Andrii", "order": 0, "color": "#0072B2" },
        { "id": "2", "name": "BatmanLongLongStoryName", "order": 1, "color": "#04080bff" },
        { "id": "3", "name": "Superman", "order": 2, "color": "#f12800ff" },
      ],
      suggestions: [
      ]
    }
    setConfig(page, 'settings', mockSettings)
  })

  test('flow: other player', async ({ page }) => {
    await page.goto('/game/play')
    await page.getByTestId('suggestion-wizard-button').click()
    await expect(page.getByTestId('step-asker')).toBeVisible()
    await page.getByTestId('pick-player-3').click()
    await expect(page).toHaveScreenshot('wizzard-asker-with-selection.png')
    await page.getByTestId('btn-next-step').click()
    await expect(page.getByTestId('step-hypothesis')).toBeVisible()
    await expect(page).toHaveScreenshot('wizzard-hypothesis.png')

    // Select suspect card for hypothesis
    await page.getByTestId('wizzard-card-slot').nth(0).click()
    await expect(page.getByTestId('shared-card-picker')).toBeVisible()
    await expect(page).toHaveScreenshot('wizzard-hypothesis-suspect-selection.png')
    await page.getByTestId('notebook-card-select').nth(0).click()
    await expect(page.getByTestId('shared-card-picker')).toBeHidden()
    await expect(page.getByTestId('wizzard-card-slot-selected').nth(0)).toBeVisible()
    await expect(page).toHaveScreenshot('wizzard-hypothesis-suspect-selected.png')

    // Select weapon card for hypothesis
    await page.getByTestId('wizzard-card-slot').nth(1).click()
    await expect(page.getByTestId('shared-card-picker')).toBeVisible()
    await page.getByTestId('notebook-card-select').nth(0).click()
    await expect(page.getByTestId('shared-card-picker')).toBeHidden()
    await expect(page.getByTestId('wizzard-card-slot-selected').nth(1)).toBeVisible()
    await expect(page).toHaveScreenshot('wizzard-hypothesis-weapon-selected.png')

    // Select room card for hypothesis
    await page.getByTestId('wizzard-card-slot').nth(2).click()
    await expect(page.getByTestId('shared-card-picker')).toBeVisible()
    await page.getByTestId('notebook-card-select').nth(0).click()
    await expect(page.getByTestId('shared-card-picker')).toBeHidden()
    await expect(page.getByTestId('wizzard-card-slot-selected').nth(2)).toBeVisible()
    await expect(page).toHaveScreenshot('wizzard-hypothesis-room-selected.png')

    // Go to next step
    await page.getByTestId('btn-next-step').click()
    await expect(page.getByTestId('step-response')).toBeVisible()
    await expect(page).toHaveScreenshot('wizzard-response.png')

    // Nobody disproved
    await page.getByTestId('pick-player-nobody').click()
    await expect(page.getByTestId('pick-player-nobody')).toHaveClass(/selected/)
    await expect(page).toHaveScreenshot('wizzard-response-nobody-disproved.png')

    // Select player who responded
    await page.getByTestId('pick-player-2').click()
    await expect(page.getByTestId('pick-player-2')).toHaveClass(/selected/)
    await expect(page).toHaveScreenshot('wizzard-response-player-selected.png')
  })
})
