import { addDoc, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore"
import { React, useEffect, useState } from "react"
import Split from "react-split"
import Editor from "./components/Editor"
import Sidebar from "./components/Sidebar"
import { db, notesCollection } from "./firebase"

// Main component for the entire application
export default function App() {
    // State variables to manage notes, currentNoteId, and temporary note changes
    const [notes, setNotes] = useState([])
    const [currentNoteId, setCurrentNoteId] = useState("")
    const [tempNote, setTempNote] = useState({})

    // Retrieve the current note based on the currentNoteId or default to the first note
    const currentNote =
        notes.find(note => note.id === currentNoteId)
        || notes[0]

    // Sort the notes based on the updateAt timestamp in descending order
    const sortedNotes = notes.sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt)
    })

    // useEffect to subscribe to changes in Firestore notes collection  
    useEffect(() => {
        const unsubscribe = onSnapshot(notesCollection, function (snapshot) {
            const notesArray = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setNotes(notesArray)
        })
        return unsubscribe
    }, [])

    // useEffect to set currentNoteId to the first note if already not set
    useEffect(() => {
        if (!currentNoteId) setCurrentNoteId(notes[0]?.id)
    }, [notes])

    // useEffect to update tempNote whenever the currentNote is changed
    useEffect(() => {
        if (currentNote) {
            setTempNote(currentNote)
        }
    }, [currentNote])

    // useEffect to handle debounced updates to the note text or title
    useEffect(() => {
        const timeOutId = setTimeout(() => {
            if (tempNote.body !== currentNote.body) {
                updateNoteText(tempNote.body)
            } else if (tempNote.title !== currentNote.title) {
                updateNoteTitle(tempNote.title)
            }
        }, 500)

        return () => clearTimeout(timeOutId)
    }, [tempNote])

    // Function to create a new note in Firestore and set it as the currentNote
    async function createNewNote() {
        const newNote = {
            title: "",
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
    }

    // Functions to update temporary note state for text and title
    const updateTempNoteText = (text) => {
        setTempNote(prevNote => ({ ...prevNote, body: text }))
    }

    const updateTempNoteTitle = (event) => {
        setTempNote(prevNote => ({ ...prevNote, [event.target.name]: event.target.value }))
    }

    // Functions to update note text and title in Firestore
    async function updateNoteText(text) {
        const docRef = doc(db, "notes", currentNoteId)
        await setDoc(docRef, { body: text, updatedAt: Date.now() }, { merge: true })
    }

    async function updateNoteTitle(title) {
        const docRef = doc(db, "notes", currentNoteId)
        await setDoc(docRef, { title: title, updatedAt: Date.now() }, { merge: true })
    }

    // Function to delete a note from Firestore
    async function deleteNote(noteId) {
        const docRef = doc(db, "notes", noteId)
        await deleteDoc(docRef)
    }

    // render the main application layout with Sidebar and Editor components
    return (
        <main>
            {
                // Conditional rendering based on the existence of notes
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={sortedNotes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            updateTempNoteTitle={updateTempNoteTitle}
                            deleteNote={deleteNote}
                        />

                        <Editor
                            tempNoteText={tempNote.body}
                            updateTempNoteText={updateTempNoteText}
                        />

                    </Split>
                    :
                    // Display a message and option to create a note, if there're no notes
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                        </button>
                    </div>

            }
        </main>
    )
}
