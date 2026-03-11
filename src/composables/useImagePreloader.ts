import { ref } from 'vue'

export function useImagePreloader() {
  const isReady = ref(false)
  const isLoading = ref(false)
  const showLoader = ref(false)
  const progress = ref(0)
  const totalImages = ref(0)
  const loadedCount = ref(0)

  const loadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = src
      img.onload = () => resolve()
      img.onerror = (err) => reject(err)
    })
  }

  const preloadAll = async (imagePaths: string[]) => {
    isLoading.value = true
    totalImages.value = imagePaths.length
    loadedCount.value = 0
    progress.value = 0

    const timer = setTimeout(() => {
      if (!isReady.value) {
        showLoader.value = true
      }
    }, 500)

    try {
      const promises = imagePaths.map((path) =>
        loadImage(path).then(() => {
          loadedCount.value++
          progress.value = Math.round((loadedCount.value / totalImages.value) * 100)
        }),
      )

      await Promise.all(promises)
    } catch (error) {
      console.error('Failed to preload some images:', error)
    } finally {
      clearTimeout(timer)
      showLoader.value = false
      isReady.value = true
    }
  }

  return {
    isReady,
    showLoader,
    progress,
    preloadAll,
  }
}
