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


