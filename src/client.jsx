import client from '@sanity/client'

export default client({
    projectId: import.meta.env.SANITY_ID,
    dataset: import.meta.env.DATASET,
    useCdn: true,
    apiVersion: import.meta.env.SANITY_API_KEY,
})
