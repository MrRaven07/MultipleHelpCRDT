


App.Editor.init = () => {
    const editorInput = document.getElementById('editorInput');
    const markdownOuput = document.getElementById('markdownOutput');
    const backBtn = document.getElementById('backBtn');
    const importBtn = document.getElementById('importBtn');
    const saveBtn = document.getElementById('saveBtn');
    const fileImport = document.getElementById('fileImport');


    document.getElementById('roomNameDisplay').innerText = `Room: ${App.State.docId}`;

    App.cmEditor = CodeMirror(editorInput, {
        lineNumbers: false, 
        lineWrapping: true, 
        value: "# Start!"
    });
    markdownOuput.innerHTML = marked.parse(App.cmEditor.getValue());

    // When the cursor updates 
    App.cmEditor.on("cursorActivity", () => {
        const cursorPos = App.cmEditor.getCursor();
        const cursorMessage = {
            type: "sync_cursor", 
            docId: App.State.docId,
            userId: App.State.myUserDetails.id, 
            color: App.State.myUserDetails.color,
            position: cursorPos, 
            timestamp: Date.now()
        };

        if (App.socket && App.socket.readyState === WebSocket.OPEN) {
            try { 
                App.socket.send(JSON.stringify(cursorMessage)); 
            }
            catch (error) {
                alert("Couldn't send the cursor activity"); 
                return; 
            }
        }
    });




    // When the text updates
    // instance would be the same as cmEditor. It tells where the change has happened
    // changeObj tells what happened
    App.cmEditor.on("change", (instance, changeObj) => {

        // If the "change" has been created by the program, ignore it
        if (changeObj.origin === 'setValue') 
            return;
        
        // If it's already updating from the network, ignore
        if (App.State.isUpdatingFromNetwork) 
            return;
        

        const myId = App.State.myUserDetails.id;
        if(!App.State.numberKeystrokesGCounter[myId]){
            App.State.numberKeystrokesGCounter[myId] = 0;
        }

        App.State.numberKeystrokesGCounter[myId] += 1;
        App.Editor.updateRosterUI();


        const currentText = App.cmEditor.getValue();

        // Even though data is transmitted after some time, the keystrokes need to update instantly on the local machine
        markdownOuput.innerHTML = marked.parse(currentText);
        
        App.State.pendingText = currentText;
        
        if (!App.State.isTimerRunning) {
            App.State.isTimerRunning = true;

            // JS works asynchronously and if the wouldn't have isTimerRunning, the timeout could be ran multiple times
            setTimeout(() => {

                // Have to verify if the socket is still running 
                if (App.socket && App.socket.readyState === WebSocket.OPEN && App.State.pendingText !== null) {
                    const syncMessage = { 
                        type: "sync", 
                        docId: App.State.docId, 
                        text: App.State.pendingText,
                        userId: myId,
                        keystrokes: App.State.numberKeystrokesGCounter[myId]
                    };
                    try { 
                        App.socket.send(JSON.stringify(syncMessage)); 
                    }
                    catch (error) { 
                        alert("Couldn't send the sync JSON message")
                        return; 
                    }
                }
                App.State.isTimerRunning = false;
                App.State.pendingText = null;
            }, 100); // milliseconds
        }
    });



    // The buttons logic
    backBtn.addEventListener('click', () => { 
        window.location.href = 'index.html'; 
    });
    importBtn.addEventListener('click', () => { 
        fileImport.click(); 
    });
    fileImport.addEventListener('change', (event) => { 
        // Grabs the first file mentioned in the input box
        const file = event.target.files[0];
        if (file) {
            // Files will be read here
        } 
    });
    
    // Saving/Downloading the file
    saveBtn.addEventListener('click', () => { 
        // JSON blob parsing
    });







    const rosterBtn = document.getElementById('rosterBtn');
    const rosterList = document.getElementById('rosterList');

    rosterBtn.addEventListener('click', () => {
        rosterList.classList.toggle('hidden');
    });

    App.Editor.updateRosterUI = () => {
        rosterList.innerHTML = '';
        
        
        const myId = App.State.myUserDetails.id;
        const myKeyStrokes = App.State.numberKeystrokesGCounter[myId] || 0;
        

        const selfself = document.createElement('div');
        selfself.className = 'roster-user';
        selfself.innerHTML = `<div class="user-color-dot" style="background-color: ${App.State.myUserDetails.color}"></div><span>${App.State.myUserDetails.id} (Self) - ${myKeyStrokes}</span>`;
        rosterList.appendChild(selfself);
        

        App.State.activeUsers.forEach((user) => {
            const peerKeyStrokes = App.State.numberKeystrokesGCounter[user.id] || 0;
            const peer = document.createElement('div');
            peer.className = 'roster-user';
            peer.innerHTML = `<div class="user-color-dot" style="background-color: ${user.color}"></div><span>${user.id} - ${peerKeyStrokes}</span>`;
            rosterList.appendChild(peer);
        });

        rosterBtn.innerText = `Users ${App.State.activeUsers.size + 1}`;

    };

    App.Editor.updateRosterUI();


};