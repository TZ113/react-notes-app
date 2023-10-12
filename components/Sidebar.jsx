import { React, useEffect, useState } from "react"

export default function Sidebar(props) {

    const showInput = (id) => {
        if (id === props.currentNote.id) {
            setTitleHidden(true)
            setTitleInputVisible(true)
        }

    }

    const handleEnterKey = (event) => {
        if (event.key === "Enter") {
            setTitleHidden(false)
            setTitleInputVisible(false)
        }
    }

    useEffect(() => {
        const hideInput = (event) => {
            const selectedTitle = document.querySelector(".selected-note .note-title")
            const selectedInput = document.querySelector(".selected-note .title-input")
            if (event.target !== selectedInput &&
                event.target !== selectedTitle &&
                selectedInput.style.display == "inline") {
                setTitleHidden(false)
                setTitleInputVisible(false)
            }
        }
        document.addEventListener('click', hideInput)

        return () => document.removeEventListener('click', hideInput)
    }, [])

    const [titleHidden, setTitleHidden] = useState(false)
    const [titleInputVisible, setTitleInputVisible] = useState(false)

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

                    <input
                        type="text"
                        style={{ display: note.id === props.currentNote.id && titleInputVisible ? "inline" : "none" }}
                        className="title-input"
                        name="title"
                        defaultValue={note.title ? note.title : note.body.split("\n")[0]}
                        onChange={(event) => props.updateTempNoteTitle(event)}
                        onKeyUp={(event) => handleEnterKey(event)}

                    />
                </h4>
                <button
                    className="delete-btn"
                    onClick={() => props.deleteNote(note.id)}
                >
                    <i className="gg-trash trash-icon"></i>
                </button>
            </div>
        </div>
    ))

    return (
        <section className="pane sidebar">
            <div className="sidebar--header">
                <h3>Notes</h3>
                <button className="new-note" onClick={props.newNote}>+</button>
            </div>
            {noteElements}
        </section>
    )
}
