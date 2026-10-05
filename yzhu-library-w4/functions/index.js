const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

// Initialise Firebase Admin so the function can access Firestore
admin.initializeApp();

// HTTP Cloud Function used to count documents in the "books" collection
exports.countBooks = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      // Get all documents from the books collection
      const booksCollection = await admin.firestore().collection("books").get();

      // Count the number of documents
      const count = booksCollection.size;

      // Return the result as JSON
      res.status(200).json({ count });
    } catch (error) {
      console.error("Error counting books:", error.message);
      res.status(500).send("Error counting books");
    }
  });
});

// HTTP Cloud Function used to get all documents in the "books" collection
exports.getAllBooks = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      // Get all documents from the books collection
      const booksCollection = await admin.firestore().collection("books").get();

      // Convert each Firestore document into a JavaScript object
      const books = booksCollection.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Return all books as JSON
      res.status(200).json(books);
    } catch (error) {
      console.error("Error getting books:", error.message);
      res.status(500).send("Error getting books");
    }
  });
});

// Firestore Cloud Function triggered when a new book is added
exports.capitalizeBook = onDocumentCreated("books/{bookId}", async (event) => {
  // Get the newly created book document
  const snapshot = event.data;

  if (!snapshot) {
    return;
  }

  const bookData = snapshot.data();

  // Capitalise all string data in the new book
  const updatedData = {};

  for (const [key, value] of Object.entries(bookData)) {
    if (typeof value === "string") {
      updatedData[key] = value.toUpperCase();
    }
  }

  // Update the Firestore document with capitalised data
  await snapshot.ref.update(updatedData);
});