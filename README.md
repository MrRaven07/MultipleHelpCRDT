# MultipleHelpCRDT

An example of a CRDT (Conflict-free replicated data type) web based program. Simliar to Google Docs.

---

### Longer description
The purpose of the project is to let 2 or multiple users type something concurrently/simultaneously and in the end save that informations in multiple types. 


---
### Short explanation of the types of CRTD
There are 2 architectures of CRDT:
- CvRDT (also called `convergent replicated data types`) The whole JSON object is being sent at each modification, then the `merge()` function compares the 2 versions. (Pros&Cons relatively easy to use, but sends all the informatios every time)
- CmRDT (also called `commutative replicated data types`) Sends just the current action (ex: "Adds 5"). (Pros&Cons Fast at sending, hard to implement and if a message is lost, the users will be desynchronised)

#### The following represents methods of implementation:

Types of counters (Stores numbers):
- G-Counter (Grow-Only Counter) Represents a number that can only be increased. Instead of a single number, it keeps a dictionary of how many times each specific user hit increment. The final total is just the sum of everyone's individual clicks.
- PN-Counter (Positive-Negative Counter) It is just two G-Counters working together: one tracks all the additions, and the other tracks all the subtractions. The final score is simply Additions - Subtractions.

Sets (Stores collections of unique items):
- 2P-Set (Two-Phase Set) A list where one can add and remove items, but once an item is removed, it can never be added back again. It uses two hidden lists: one for "added" items and one for "removed" items. An item is visible on the screen only if it is in the "added" list and not in the "removed" list.

Registers (Stores a single value):
- LWW-Register (Last-Write-Wins Register) Whenever someone changes the value, it attaches a timestamp. If two users change it simultaneously, the system compares timestamps and keeps the one that happened last.

---

Things i think that will be difficult:
- the communication between different devices
- the UI (i will choose vanilla css/js as other frontend frameworks seem to be beyond the project scope)
- how will all the keys be stored
- how to differentiate between the keys pressed by each user
- the most common problem of 2 devices pressing keys in the same time
- if there will be problems with the cursor of the users (how will the cursor staying behind be solved)
- how would an undo stack work in here  
- how copy and paste would work
- how to properly make the text box (As i don't know if a simple html text box would cut it. And coding a text box from scratch seems way much more than i anticipated from this project (Alignment, fonts, selection) ; but in the end i whink i will stick with `<textarea>` )
- the almost infinite expansion of the project (tombstone accumulation ; where tombstones are the letters that were deleted. For example, if i copy pasted the entire Godfather I movie script/subtitles and after that deleted everything, there will be a lot of tombstones, which will occupy space for almost nothing)

---

Roadmap:
- [ ] Make a simple dummy starter code for the frontend
- [ ] Create the server with Node.js which just receives and sends data between the devices/people connected
- [ ] Connect the websockets with client-server architecture
- [ ] Plain text transmission, without CRDT
- [ ] Start of the CvRDT
- [ ] Implement G-Counter
- [ ] Implement LWW-Register
- [ ] Implement Tombstoned LWW-Register

--- 

### Possible workflows of the app usage (and storing of the files) (we consider 2 persons, Alice and Bob):
- Alice opens `localhost:XXXX`. The page redirects her to a new room/subdomain `localhost:XXXX/?doc=super-project`
- Alice imports her `.json` file she saved previously and the screen populates with text
- Bob connects to the same link as Alice `localhost:XXXX/?doc=super-project`. The two share the same state because of the WebSocket room
- They type together, everything being stored localy
- When they are done, Bob clicks "Download" to save the `.json` to his computer 
---

### AI usage throughout the project:

Everything in the project has been written by hand, on the keyboard. Even though some things were from an AI response, i've read the answers, thought about how and if the answer is usefull and wrote it again. 
At least this is the current mentality, we will see how this progresses.

Even though the current `README` might look like it was AI generated, it wasn't. (This might be because in the past i wanted to make `READMEs` more appealing and inspired from AI creations.) 

---

### Inspirations:
- Google Docs 
- https://framapad.org/abc/en/

--- 
Bibliography:
- https://crdt.tech/resources
- https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type
- Google Gemini - https://gemini.google.com/ :
    -> For how different parts of languages work
    -> 
