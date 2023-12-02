import propTypes from "prop-types"
import { React, useEffect, useState } from "react"

/**
 * Sidebar component for displaying notes and managing interactions.
 * @param {Object} props - Component properties.
 * @param {Object} props.currentNote - Currently selected note.
 * @param {Array} props.notes - Array of notes to display.
 * @param {Function} props.newNote - Function to create a new note.
 * @param {Function} props.setCurrentNoteId - Function to set the current note ID.
 * @param {Function} props.updateTempNoteTitle - Function to update temporary note title.
 * @param {Function} props.deleteNote - Function to delete a note.
 * @returns {JSX.Element} - Sidebar component.
 */

export default function Sidebar(props) {
    // State variables to manage title and titleInput visibility 
    const [titleHidden, setTitleHidden] = useState(false)
    const [titleInputVisible, setTitleInputVisible] = useState(false)

    // Show input for a specific note title when clicked
    const showInput = (id) => {
        if (id === props.currentNote.id) {
            setTitleHidden(true)
            setTitleInputVisible(true)
        }

    }

    // Hide the title input when "Enter" key is pressed
    const handleEnterKey = (event) => {
        if (event.key === "Enter") {
            setTitleHidden(false)
            setTitleInputVisible(false)
        }
    }

    // useEffect to hide the input when clicked outside the selected title input
    useEffect(() => {
        const hideInput = (event) => {
            const selectedTitle = document.querySelector(".selected-note .note-title")
            const selectedInput = document.querySelector(".selected-note .title-input")
            if (event.target !== selectedInput &&
                event.target !== selectedTitle &&
                selectedInput.style.display === "inline") {
                setTitleHidden(false)
                setTitleInputVisible(false)
            }
        }
        document.addEventListener('click', hideInput)

        // Cleanup: remove event listener when component unmounted
        return () => document.removeEventListener('click', hideInput)
    }, [])

    // map notes to JSX elements
    const noteElements = props.notes.map((note) => (
        <div key={note.id}>
            <div

                className={`title ${note.id === props.currentNote.id ? "selected-note" : ""
                    }`}
                onClick={() => props.setCurrentNoteId(note.id)}
            >
                <h4 className="text-snippet">
                    <span className="note-title"
                        onClick={() => showInput(note.id)}
                        style={{ display: note.id === props.currentNote.id && titleHidden ? "none" : "inline" }}>
                        {note.title ? note.title : note.body.split("\n")[0]}
                    </span>

                    {/* Input for editing the title */}
                    <input
                        type="text"
                        style={{ display: note.id === props.currentNote.id && titleInputVisible ? "inline" : "none" }}
                        className="title-input"
                        name="title"
                        defaultValue={note.title ? note.title : note.body.split("\n")[0]}
                        onChange={(event) => props.updateTempNoteTitle(event)}
                        onKeyUp={(event) => handleEnterKey(event)}

                    />
                    {/* Display done symbol when title input is visible */}
                    {note.id === props.currentNote.id && titleInputVisible && <span className="material-symbols-outlined">done</span>}
                </h4>
                {/* Button to delete the note */}
                <button
                    className="delete-btn"
                    onClick={() => props.deleteNote(note.id)}
                >
                    <i className="gg-trash trash-icon"></i>
                </button>
            </div>
        </div>
    ))

    // Sidebar component JSX
    return (
        <section className="pane sidebar">
            <div className="sidebar--header">
                <h3>Notes</h3>
                {/* Button to create a new note */}
                <button className="new-note" onClick={props.newNote}>+</button>
            </div>
            {/* Display notes */}
            {noteElements}
        </section>
    )
}

// Define protoTypes for component validation 
Sidebar.propTypes = {
    currentNote: propTypes.object.isRequired,
    notes: propTypes.array.isRequired,
    newNote: propTypes.func.isRequired,
    setCurrentNoteId: propTypes.func.isRequired,
    updateTempNoteTitle: propTypes.func.isRequired,
    deleteNote: propTypes.func.isRequired
}
