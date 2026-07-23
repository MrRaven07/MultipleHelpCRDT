## This document contains details related to how does the project work.



Color Palettes that i chose:
https://colorhunt.co/palette/30364facbac4e1d9bcf0f0db
From the darkest to the lightest:
- #0b0b2a
- #30364F
- #2d3556
- #ACBAC4
- #E1D9BC
- #F0F0DB


---

**How does the backend (should) work?**

1. The connection
A browser opens a WebSocket to the server.
The server answers, but it doesn't know yet who the browser is and the document they want to edit.

2. The handshake
The browser sends a JSON request saying that it wants to connect to a specific room (ex: doc_123456)

3. The registry 
The server verifies if the room already exists in a list. If it doesn't, the server creates a new one, then it adds the browser's connection to that room.

4. The relay
When the browser sends an update (for every key pressed), the server searches in the list all the other browsers connected to the room and forwards the message to them.

5. The cleanup
When a browser closes the tab, the server erases them from the list.

---

**What's the difference between CvRDT and CmRDT?**
_Taken from the `README/md`_
There are 2 architectures of CRDT:
- CvRDT (`convergent replicated data types`) The whole JSON object is being sent at each modification, then a merge function compares the 2 versions. 
Pros & Cons: relatively easy to use, but sends all the informatios every time
- CmRDT (`commutative replicated data types`) Sends just the current action (ex: "Adds 5"). 
Pros & Cons Fast at sending, hard to implement and if a message is lost, the users will be desynchronised

---

**How does GCounter works and where can it be used?**

---

**How does LWW works and where can it be used?**

---

**How does CodeMirror work?**

CodeMirror uses a single `<div>` and makes it behave as a textarea block.

It does that with DOM injection. CodeMirror injects 2 layers inside the `<div>`:
- Creates an invisible `<textarea>` that forces the browser's focus onto it. (This insures that things like spellcheck, copy/paste still work)
- Creates a lot of `<span>` and `<div>` elements that can be used to style however the user want. First, it takes the keystroke, then deletes it from the box and puts it into the div/span tag.



`const cmEditor = CodeMirror(editorInput, {`
- The part with `CodeMirror(...)` calls the library core builder function.
- `editorInput` is the DOM element where CodeMirror will inject the invisible textarea and the visual stage


`lineNumbers: ...,` : tells CodeMirror not to render the vertical line numbering (that appears on almost all code editors)


`lineWrapping: true,` : wrap the text to the next line instead of going off-screen


`mode: "markdown",` : marks the text as a special and puts it into a `<span>`

`value: " # start "` : Populates the default appearing



---

**How the formatting appears on the right?**

It doesn't come from CodeMirror. It is a collaboration between CodeMirror and the Marked.js.

The loop that connects the two:
```javascript
cmEditor.on("change", () => {
    // 1. Grab raw text
    const currentText = cmEditor.getValue();
    
    // 2. Parse and render
    markdownOuput.innerHTML = marked.parse(currentText);
});
```

`.on("change")` : gets activated every time a keystroke alters the CodeMirror element

`marked.parse()` : converts Markdown syntax into HTML tags
ex: `"# Hello world!"` into `<h1>Hello world</h1>` 

---

**G-Counter implementation for the number of keystrokes**
- All the users connected to a room maintain a Map of everyone's keystrokes
- A user increment their own score upon writing
- When a user 


---
