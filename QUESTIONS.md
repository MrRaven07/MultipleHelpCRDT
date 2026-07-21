## This document contains a part of my questions that i got throughout the development of the project. 



**Explanation of the files:**
- `index.html` handles the Main Menu / Dashboard (where new rooms can be created)
- `editor.html` represents the CRDT Workspace where people can type.
- `style.css` holds the style for both `index.html` or `editor.html` (might change to two different files in the future)

--- 

**What does `<!DOCTYPE html>` do?**

`<!DOCTYPE html>` is the declaration for HTML5 (Standard Mode). If it doesn't exist, the browser assumes the page was built in 1990-2000. (Quirks Mode)

---

**How does `display: flex` work?**

When one gives `display: flex` to an element, two things will happen:
- the element (parent of the elements that will follow) becomes a "Flex Container"
- the direct children become "Flex Items" (but only the direct children)

When `display: flex` is on, the normal rules don't apply really apply anymore, but there are new commands that can be used:
- `flex-direction` : Tell the items which way to flow, default is `row`, left to right, can be changed to `column` (top to bottom)   
- `justify-content` : Allign items along the main axis (horizontally, if in row). Can push the items in the center, space them even (`space-between`), or push them to the ends
- `align-items` : Aligns items along the cross (vertically, if in row), can be stretched to fill the container, or center in the middle


`display: flex` can be given to the body in order to center items more easily

---

**What is `rem`?**

`rem` stands for `Root EM`.

Instead of using fixed pixels, rem scales based on the default font size of the user's browser (which is usually 16px).
- 1rem = 16px
- 3rem = 48px 

---

**How does the blinking cursor work?**

```
        <h1 class="title">MultipleHelper<span class="cursor"></span></h1>
---------------------------------------------------
        .cursor::after {
            content: '█'; /* Can be changed with | */
            animation: blink 1s step-end infinite;
        }
        @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0; }
        } 
```

`<span>` is a blank wrapper for text, it has no style on its own.

`::after` is a pseudo-element in CSS, it injects content onto the page from the CSS file without typing it in HTML.

`animation: blink 1s step-end infinite;` 
- `blink` represents the name of the animation
- `1s` the duration, it takes 1 second to complete the whole cycle
- `step-end` stops the smooth animation and make it linear 
- `infinite` makes it infinite 

The `@keyframes` part:
- `0%` opacity 1
- `50%` opacity 0
(after that, it goes back to 0%, which will make it 1 again)


---

**When to use id and when to use class in HTML?**

1. `class` is for multiple, reusable elements. Good to use when one wants to repeat a style or behaviour across the page.
2. `id` is for a single element, one id name per HTML page
    It's rarely used for CSS styling `#editor-input` , as CSS makes it hard for it to be overwritten in the future.
    It's good to use `id` for the following things:
    + JS hooks `document.getElementById('submit-btn')`
    + Anchor links `<a href="#contact-links">


---

---
**Would the following code be necessary in JS?**
```
// Waits for the HTML to fully load before running
document.addEventListener('DOMContentLoaded', () => {
});
```

Browsers read HTML documents from top to bottom, if it encounters a `<script>` tag, it pauses the reading from the HTML and executes the JavaScript.

If the browser find `<script>` in the head, it will be ran even before the `<body>` exists.

So, the listener `DOMContentLoaded` waits for the whole HTML file to load and only after that, runs the JavaScript.

Some other variants would be:  
```html
<head>
<script src="app.js" defer></script>
</head>
```
`defer` tells the browser to downlaod the JavaScript file in the background while reading the HTML and guarantees that the script will execute only after the HTML is fully parsed.


Or put the `<script src="app.js"></script>` at the bottom of the body.


---

**What is localStorage?**

From my understanding, localStorage saves all (and only) the text strings.
It is persistent.
localStorage can be seen in the `Inspect tab`, `Application`, and then under the `Storage` section, there is `Local storage`.


---

**What does this input `<input type="file" id="fileImport" style="display: none;" accept=".json,.txt">` do in `editor.html`?**


```
importBtn.addEventListener('click', () => {
        fileImport.click();
    });
```


---

**How to check the WebSocket server with Burp?**


---

**What's the difference between Sockets and WebSockets?**


---

**When a client receives data from the Node.js server**
it receives it as raw buffer data, not string, so the following code will be needed the moment the client receives it:

```
const messageAsString = rawData.toString();
```

---

**How can i use another programming language in order to make the CRDT program?**

First thought, was a naive one, "if i'm using websockets to connect to the server, why can't i create a python container (for exmaple), receive, parse and do the operations based on the informations and send them back?".
Then i though about the nightmare about how things will be connected and that it will be slow (if 5000 would want to connect to the server at once).

I searched more and one thing i found was that one can use any program language he wants as long as it can compile into a `.wasm` file and it will be inserted into the pure html/js ones.

But for the moment the project will stick with plain html/css/js.

---

**What's GCounter? (in detail)**

The best explanation i could get for someone that just gets in the subject is the following:

An user is playing an arcade game on a server.

Naive version:
The users sends information about each point obtained.
If the user scores 5 points, they send this message to the server, but on the way the connection might glitch and the information could be transmitted multiple times. This rezults in "Add 5 Add 5 Add 5" => Score 15

GCounter version:
The user sends his total points each time.
In case that the connection glitches, the users just transmits their maximum points each time. (If there is a packet that has fewer points, it is ignored.)

By sending states, instead of operations, duplicate messages become harmless.

---

**What is Sequence CRDT?**


