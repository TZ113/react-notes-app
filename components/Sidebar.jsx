import PropTypes from "prop-types"
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
                    {note.id === props.currentNote.id && titleInputVisible && <svg className="done"
                        xmlns="http://www.w3.org/2000/svg" cursor="pointer" height="28" width="28" viewBox="0 0 448 512"><path  fill="#35f81b" d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" /></svg>}
                </h4>
                {/* Button to delete the note */}
                <button
                    className="delete-btn"
                    onClick={() => props.deleteNote(note.id)}
                >
                    {/* Display trash icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" cursor="pointer" height="20" width="17.5" viewBox="0 0 448 512"><path fill="#dd0e0e" d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg>
                </button>
            </div>
        </div>
    ))

    // Sidebar component JSX
    return (
        <section className="pane sidebar">
            <div className="sidebar--header">
                <h2>Notes</h2>
                
                {/* Display add icon */}
                <svg onClick={props.newNote} cursor="pointer" xmlns="http://www.w3.org/2000/svg" height="32" width="32" viewBox="0 0 448 512"><path fill="#35f81b" d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg>

            </div>
            {/* Display notes */}
            {noteElements}
        </section>
    )
}

// Define protoTypes for component validation 
Sidebar.propTypes = {
    currentNote: PropTypes.object.isRequired,
    notes: PropTypes.array.isRequired,
    newNote: PropTypes.func.isRequired,
    setCurrentNoteId: PropTypes.func.isRequired,
    updateTempNoteTitle: PropTypes.func.isRequired,
    deleteNote: PropTypes.func.isRequired
}
