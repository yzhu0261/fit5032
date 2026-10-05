<template>
  <div>
    <h1>Books with ISBN &gt; 1000</h1>

    <ul>
      <li v-for="book in books" :key="book.id">
        {{ book.name }} (ISBN: {{ book.isbn }})

        <button @click="updateBook(book.id)">
          Update
        </button>

        <button @click="deleteBook(book.id)">
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import db from '../Firebase/init.js'
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'

const books = ref([])

// Retrieve books from Firestore
const fetchBooks = async () => {
  try {
    const q = query(
      collection(db, 'books'),
      where('isbn', '>', 1000),
      orderBy('isbn', 'asc'),
    )

    const querySnapshot = await getDocs(q)

    const booksArray = []

    querySnapshot.forEach((doc) => {
      booksArray.push({
        id: doc.id,
        ...doc.data()
      })
    })

    books.value = booksArray
  } catch (error) {
    console.error('Error fetching books: ', error)
  }
}

// Update a book in Firestore
const updateBook = async (id) => {
  try {
    const newName = prompt('Enter the new book name:')

    if (!newName) {
      return
    }

    const bookRef = doc(db, 'books', id)

    await updateDoc(bookRef, {
      name: newName
    })

    alert('Book updated successfully!')

    // Refresh the book list
    await fetchBooks()
  } catch (error) {
    console.error('Error updating book: ', error)
  }
}

// Delete a book from Firestore
const deleteBook = async (id) => {
  try {
    const bookRef = doc(db, 'books', id)

    await deleteDoc(bookRef)

    alert('Book deleted successfully!')

    // Refresh the book list
    await fetchBooks()
  } catch (error) {
    console.error('Error deleting book: ', error)
  }
}

onMounted(() => {
  fetchBooks()
})
</script>