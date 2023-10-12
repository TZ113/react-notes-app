import { React, useState, useEffect } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { notesCollection, db } from "./firebase"
import { onSnapshot, doc, addDoc, deleteDoc, setDoc } from "firebase/firestore"

export default function App() {
    const [notes, setNotes] = useState([])

    const [currentNoteId, setCurrentNoteId] = useState("")

    const [tempNote, setTempNote] = useState({})

    const currentNote =
        notes.find(note => note.id === currentNoteId)
        || notes[0]

    const sortedNotes = notes.sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt)
    })

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

    useEffect(() => {
        if (!currentNoteId) setCurrentNoteId(notes[0]?.id)
    }, [notes])

    useEffect(() => {
        if (currentNote) {
            setTempNote(currentNote)
        }
    }, [currentNote])


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

    const updateTempNoteText = (text) => {
        setTempNote(prevNote => ({ ...prevNote, body: text }))
    }

    const updateTempNoteTitle = (event) => {
        setTempNote(prevNote => ({ ...prevNote, [event.target.name]: event.target.value }))
    }

    async function updateNoteText(text) {
        const docRef = doc(db, "notes", currentNoteId)
        await setDoc(docRef, { body: text, updatedAt: Date.now() }, { merge: true })
    }

    async function updateNoteTitle(title) {
        const docRef = doc(db, "notes", currentNoteId)
        await setDoc(docRef, { title: title, updatedAt: Date.now() }, { merge: true })
    }

    async function deleteNote(noteId) {
        const docRef = doc(db, "notes", noteId)
        await deleteDoc(docRef)
    }


    return (
        <main>
            {
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
