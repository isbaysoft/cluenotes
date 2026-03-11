declare module 'pluralize' {
  type Pluralize = {
    (word: string, count?: number, inclusive?: boolean): string
    plural(word: string): string
    singular(word: string): string
    isPlural(word: string): boolean
    isSingular(word: string): boolean
  }

  const pluralize: Pluralize
  export default pluralize
}
