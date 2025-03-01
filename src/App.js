import { useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import { Route, Routes, useNavigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import AddPost from "./pages/AddPost"
import Posts from "./pages/Posts"
import firebase from "./utils/firebase"
import PostsContext from "./utils/PostsContext"
import Books from "./pages/Books"
import AddBook from "./pages/AddBook"

function App() {
  const [posts, setPosts] = useState([])
  const [books, setBooks] = useState([])
  const navigate = useNavigate()

  const getPosts = async () => {
    const postsRef = await firebase.database().ref("posts").once("value")
    const posts = postsRef.val()
    const postsArray = []
    for (const key in posts) {
      postsArray.push({ ...posts[key], id: key })
    }

    setPosts(postsArray)
  }
  const getBooks = async () => {
    const booksRef = await firebase.database().ref("books").once("value")
    const books = booksRef.val()
    const booksArry = []
    for (const key in books) {
      booksArry.push({ ...books[key], id: key })
    }
console.log(booksArry)
    setBooks(booksArry)
  }

  useEffect(() => {
    getPosts()
    getBooks()
  }, [])

  const addPost = async e => {
    e.preventDefault()
    try {
      const form = e.target
      const postBody = {
        title: form.elements.title.value,
        body: form.elements.body.value,
        image: form.elements.image.value,
        owner: form.elements.owner.value,
      }

      await firebase.database().ref("/posts").push(postBody)
      toast.success("post added")
      getPosts()
      navigate("/")
    } catch (error) {
      toast.error(error.code)
    }
  }

  const deletePost = async postId => {
    try {
      await firebase.database().ref(`posts/${postId}`).remove()
      toast.success("post deleted")
      getPosts()
    } catch (error) {
      toast.error(error.code)
    }
  }

  const editPost = async (e, postId) => {
    e.preventDefault()
    try {
      const form = e.target
      const postBody = {
        title: form.elements.title.value,
        body: form.elements.body.value,
        image: form.elements.image.value,
        owner: form.elements.owner.value,
      }
      console.log(postBody)
      await firebase.database().ref(`posts/${postId}`).update(postBody)
      toast.success("post is updated")
      getPosts()
    } catch (error) {
      toast.error(error.code)
    }
  }

//---------------------------------//
  
  const addBook = async e => {
    e.preventDefault()
    try {
      const form = e.target
      const bookBody = {
        title: form.elements.title.value,
        releaseYear: form.elements.releaseYear.value,
        image: form.elements.image.value,
        numberOfCopies: form.elements.numberOfCopies.value,
      }

      await firebase.database().ref("/books").push(bookBody)
      toast.success("book added")
      getBooks()
      navigate("/books")
    } catch (error) {
      toast.error(error.code)
    }
  }

  const deleteBook = async bookId => {
    try {
      await firebase.database().ref(`books/${bookId}`).remove()
      toast.success("book deleted")
      getBooks()
    } catch (error) {
      toast.error(error.code)
    }
  }

  const editBook = async (e, bookId) => {
    e.preventDefault()
    try {
      const form = e.target
      const bookBody = {
        title: form.elements.title.value,
        releaseYear: form.elements.releaseYear.value,
        image: form.elements.image.value,
        numberOfCopies: form.elements.numberOfCopies.value,
      }
      console.log(bookBody)
      await firebase.database().ref(`books/${bookId}`).update(bookBody)
      toast.success("book is updated")
      getBooks()
    } catch (error) {
      toast.error(error.code)
    }
  }

  const store = { posts, addPost, deletePost, editPost,books,addBook,deleteBook, editBook}

  return (
    <PostsContext.Provider value={store}>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/posts" element={<Posts />} />
        <Route path="/add-post" element={<AddPost />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add-book" element={<AddBook />} />
      </Routes>
    </PostsContext.Provider>
  )
}

export default App
