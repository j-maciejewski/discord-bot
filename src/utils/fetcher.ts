const fetcher = async <T>(url: string): Promise<{ data: T, error: null } | { data: null, error: Error }> => {
  return await fetch(url)
    .then(async response => {
      try {
        if (!response.ok) {
          return { data: null, error: new Error(response?.statusText) }
        }
  
        const data = await response.json()
  
        return { data, error: null }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error)
          return { data: null, error: new Error(error.message) }
        }
      }
      
    })
}

export { fetcher }
