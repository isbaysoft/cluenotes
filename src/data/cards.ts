import { type Card } from '@/models/card'

const cards: Card[] = [
  // Suspects
  {
    id: 'suspect-miss-scarlett',
    name: 'Miss Scarlett',
    type: 'suspect',
    image: 'scarlett.webp',
  },
  {
    id: 'suspect-colonel-mustard',
    name: 'Colonel Mustard',
    type: 'suspect',
    image: 'mustard.webp',
  },
  {
    id: 'suspect-dr-orchid',
    name: 'Dr. Orchid',
    type: 'suspect',
    image: 'orchid.webp',
  },
  {
    id: 'suspect-mr-green',
    name: 'Mr. Green',
    type: 'suspect',
    image: 'green.webp',
  },
  {
    id: 'suspect-mrs-peacock',
    name: 'Mrs. Peacock',
    type: 'suspect',
    image: 'peacock.webp',
  },
  {
    id: 'suspect-professor-plum',
    name: 'Professor Plum',
    type: 'suspect',
    image: 'plum.webp',
  },

  // Weapons
  {
    id: 'weapon-candlestick',
    name: 'Candlestick',
    type: 'weapon',
    image: 'candlestick.webp',
  },
  {
    id: 'weapon-revolver',
    name: 'Revolver',
    type: 'weapon',
    image: 'revolver.webp',
  },
  {
    id: 'weapon-rope',
    name: 'Rope',
    type: 'weapon',
    image: 'rope.webp',
  },
  {
    id: 'weapon-wrench',
    name: 'Wrench',
    type: 'weapon',
    image: 'wrench.webp',
  },
  {
    id: 'weapon-dagger',
    name: 'Dagger',
    type: 'weapon',
    image: 'dagger.webp',
  },
  {
    id: 'weapon-lead-pipe',
    name: 'Lead Pipe',
    type: 'weapon',
    image: 'lead_pipe.webp',
  },

  // Rooms
  {
    id: 'room-conservatory',
    name: 'Conservatory',
    type: 'room',
    image: 'conservatory.webp',
  },
  {
    id: 'room-billiard-room',
    name: 'Billiard Room',
    type: 'room',
    image: 'billiard.webp',
  },
  {
    id: 'room-dinning-room',
    name: 'Dinning Room',
    type: 'room',
    image: 'dinning.webp',
  },
  {
    id: 'room-library',
    name: 'Library',
    type: 'room',
    image: 'library.webp',
  },
  {
    id: 'room-study',
    name: 'Study',
    type: 'room',
    image: 'study.webp',
  },
  {
    id: 'room-hall',
    name: 'Hall',
    type: 'room',
    image: 'hall.webp',
  },
  {
    id: 'room-lounge',
    name: 'Lounge',
    type: 'room',
    image: 'lounge.webp',
  },
  {
    id: 'room-kitchen',
    name: 'Kitchen',
    type: 'room',
    image: 'kitchen.webp',
  },
  {
    id: 'room-ballroom',
    name: 'Ballroom',
    type: 'room',
    image: 'ballroom.webp',
  },

  // SPECIAL
  {
    id: 'unknow-shown',
    name: 'Unknow',
    type: 'special',
    image: 'unknow_shown.webp',
  },
  {
    id: 'final-guess',
    name: 'Final guess',
    type: 'special',
    image: 'final_guess.webp',
  },
  {
    id: 'accusation-confirmed',
    name: 'Confirmed!',
    type: 'special',
    image: 'accusation_confirmed.webp',
  },
  {
    id: 'accusation-failed',
    name: 'Failed!',
    type: 'special',
    image: 'accusation_failed.webp',
  },
]

export default cards
