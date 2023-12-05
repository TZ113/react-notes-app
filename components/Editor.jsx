import PropTypes from "prop-types";
import React from "react";
import ReactMde from "react-mde";
import 'react-mde/lib/styles/css/react-mde-all.css';
import Showdown from "showdown";
import xssfilter from "showdown-xss-filter";

// Component representing the Editor for note text
// It takes two props: tempNoteText, updateTempNoteText
export default function Editor({ tempNoteText, updateTempNoteText }) {
    // State to manage the selected tab (write/preview) in the editor
    const [selectedTab, setSelectedTab] = React.useState("write" | "preview")

    // Create a showdown converter with specific options for markdown rendering
    const converter = new Showdown.Converter({ extensions: [xssfilter] })
    converter.setFlavor('github')


    // Render the Editor component with ReactMde, providing necessary props
    return (
        <section className="pane editor">
            <ReactMde
                value={tempNoteText}
                onChange={updateTempNoteText}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                generateMarkdownPreview={(markdown) =>
                    Promise.resolve(converter.makeHtml(markdown))
                }
                minEditorHeight={100}
                maxEditorHeight={100}
                heightUnits="vh"
            />
        </section>
    )
}

// Define prop types for component validation 
Editor.propTypes = {
    tempNoteText: PropTypes.string.isRequired,
    updateTempNoteText: PropTypes.func.isRequired
}