const assetsDict = import.meta.glob('@/assets/**/*.{png,jpg,jpeg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

export const allAssetsUrls = Object.values(assetsDict)

export const getCardImageUrl = (type: string, imageName: string): string => {
  const searchPart = `/${type}/${imageName}`
  const foundKey = Object.keys(assetsDict).find((key) => key.includes(searchPart))

  if (foundKey) {
    return assetsDict[foundKey] as string
  }

  console.error(`❌ Image not found in src/assets: ${type}/${imageName}`)
  return ''
}
