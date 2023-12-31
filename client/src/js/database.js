import { openDB } from 'idb'

const initdb = async () =>
  openDB('inkflow', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('inkflow')) {
        return
      }
      db.createObjectStore('inkflow', { keyPath: 'id', autoIncrement: true })
    },
  })

// Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {
  try {
    const editorDB = await openDB('inkflow', 1)
    const idbTransaction = editorDB.transaction('inkflow', 'readwrite')
    const idbStore = idbTransaction.objectStore('inkflow')
    const request = idbStore.put({ id: 1, value: content })

    const result = await request
  } catch (error) {
    console.error('Error saving data to database', error)
  }
}

// Add logic for a method that gets all the content from the database
export const getDb = async () => {
  try {
    const editorDB = await openDB('inkflow', 1)
    const idbTransaction = editorDB.transaction('inkflow', 'readonly')
    const idbStore = idbTransaction.objectStore('inkflow')
    const request = idbStore.getAll()
    const result = await request
    return result
  } catch (error) {
    console.error('Error getting data from database', error)
  }
}

initdb()
