
function generateUser() {
    
    // The following 2 were inspired by AI
    const adjectives = [
        'Glitchy', 'Overclocked', 'Laggy', 'Deprecated', 'Headless', 'Throttled', 'Bootlooping',
        'Pixelated', 'Encrypted', 'Buggy', 'Hardcoded', 'Bypassed', 'Frozen', 'Bricked',
        'Zipped', 'Cached', 'Caffeinated', 'Derpy', 'Sweaty', 'Chunky', 'Sassy', 'Wobbly',
        'Squeaky', 'Grumpy', 'Fluffy', 'Majestic', 'Awkward', 'Zesty', 'Snarky', 'Jittery',
        'Panicking', 'Soggy', 'Crusty', 'Wacky', 'Bouncy', 'Sneaky', 'Dizzy', 'Fidgety',
        'Lopsided', 'Noodly', 'Radioactive', 'Sputtering', 'Screaming', 'Leaky', 'Smelly',
        'Dazzling', 'Baffled', 'Giggling', 'Hiccuping', 'Jumbled'
    ];
    
    const nouns = [
        'Docker', 'Battery', 'USB', 'Dongle', 'Bug', 'Server', 'Router', 'Keyboard',
        'Algorithm', 'Cache', 'Cookie', 'Motherboard', 'Floppy', 'Pixel', 'Repo',
        'Firewall', 'Database', 'Packet', 'Modem', 'Syntax', 'Terminal', 'Kernel',
        'Sandbox', 'Compiler', 'Byte', 'Framework', 'Node', 'Socket', 'Cloud',
        'Malware', 'Exception', 'Pointer', 'Stack', 'Capacitor', 'Transistor',
        'Penguin', 'Sloth', 'Badger', 'Wombat', 'Platypus', 'Weasel', 'Alpaca',
        'Capybara', 'Lemur', 'Meerkat', 'Opossum', 'Otter', 'Raccoon', 'Walrus', 'Yeti'
    ];
    
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * adjectives.length)];
    
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const toHex = (num) => num.toString(16).padStart(2, '0');
    
    const randomColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

    // From 100 to 1000
    const randomNumber = Math.floor(Math.random() * 900) + 100;
    return {
        id: `${randomAdj}${randomNoun}${randomNumber}`,
        color: randomColor
    }
}



// Added this part that checks first if all the HTML parts were loaded first
// in order that we can return from it if some things go wrong
document.addEventListener('DOMContentLoaded', () => {

    const myUserDetails = generateUser();    
    let cursorMapLWW = {};


    // to let the local synchronise with the room 
    let isUpdatingFromNetwork = false;

    // Holds the text that has to be sent
    let pendingText = null;
    // Prevents multiple timers from running
    let isTimerRunning = false;



    const editorInput = document.getElementById('editorInput');
    const markdownOuput = document.getElementById('markdownOutput');

    const cmEditor = CodeMirror(editorInput, {
        lineNumbers: false,
        lineWrapping: true,
        value: " # Start here!"
    });

    markdownOuput.innerHTML = marked.parse(cmEditor.getValue());


    const backBtn = document.getElementById('backBtn');
    const importBtn = document.getElementById('importBtn');
    const saveBtn = document.getElementById('saveBtn');
    const fileImport = document.getElementById('fileImport');


    const urlParams = new URLSearchParams(window.location.search);
    const docId = urlParams.get('doc');


    if (!docId) {
        alert(`The doc parameters ${window.location.search} were not alright, try to access a new room.`)
        window.location.href = 'index.html';
        return;        
    }



    const socket = new WebSocket('ws://localhost:7053');

    // When the connection opens
    socket.onopen = () => {
        alert(`Connected to the server. Room: ${docId}`)
        
        // sending the join message
        const joinMessage = {
            type: 'join',
            docId: docId,
            text: pendingText
        };

        try {
            socket.send(JSON.stringify(joinMessage));
        }
        catch (error) {
            console.log('The JSON transmitted was invalid');
            console.log(event.data);
            console.log(error);
            alert("The JSON transmitted was invalid")
            return;
        }
        // WebSockets cannot parse JSONs so it must be sent as a raw string
        socket.send(JSON.stringify(joinMessage));
    }





    // When a message was received from the server
    socket.onmessage = (event) => {

        let incomingData;
        try {
            incomingData = JSON.parse(event.data);
        }
        catch (error) {
            console.log('Received invalid JSON');
            console.log(event.data);
            alert("The JSON received was invalid")
            return;
        }

        // sync/update on the text
        if (incomingData.type === 'sync'){

            console.log("sync");
            
            isUpdatingFromNetwork = true;

            cmEditor.setValue(incomingData.text);
            markdownOuput.innerHTML = marked.parse(incomingData.text);

            isUpdatingFromNetwork = false;            
        }

        if (incomingData.type === 'sync_cursor'){

            console.log("sync_cursor");

            const userId = incomingData.userId;
            const position = incomingData.position;
            const timestamp = incomingData.timestamp;
            const color = incomingData.color;

            // Ignoring the cursor of self (even though the server verifies the ) 
            if(userId === myUserDetails.id)
                return;

            // If the user cursor doesn't yet exist or the timestamp is smaller than the one received
            if(!cursorMapLWW[userId] || cursorMapLWW[userId].timestamp < timestamp) {

                // if this user already has a cursor on the screen, remove it
                if(cursorMapLWW[userId] && cursorMapLWW[userId].marker) {
                    cursorMapLWW[userId].marker.clear();
                }

                const cursorElement = document.createElement('span');
                cursorElement.className = 'remote-cursor'
                cursorElement.style.borderLeft = `2px solid ${color || '#ff0000'}`;
                cursorElement.style.height = '1.2em';
                cursorElement.style.display = 'inline-block';


                const newMarker = cmEditor.setBookmark(position, { widget: cursorElement });
                
                cursorMapLWW[userId] = {
                    timestamp: timestamp,
                    marker: newMarker
                };
            }
        }




    };

    // In case that the servers crashes
    socket.onclose = () => {
        console.warn("The server is inactive");
        alert("The server is inactive, try to reload the page");
    };






    cmEditor.on("cursorActivity", () => {
        
        const cursorPos = cmEditor.getCursor();

        const cursorMessage = {
            type: "sync_cursor",
            docId: docId,
            userId: myUserDetails.id,
            color: myUserDetails.color,
            position: cursorPos,
            timestamp: Date.now()
        };

        if (socket.readyState === WebSocket.OPEN) {
            try {
                socket.send(JSON.stringify(cursorMessage));
            }
            catch (error) {
                console.log("Couldn't send the cursor activity");
                console.log(cursorMessage);
                console.log(error);
                alert("Couldn't send the cursor activity")
                return;
            }
        }



    });


    // Every time there's a change in the div CodeMirror box
    // instance would be the same as cmEditor. It tells where the change has happened
    // changeObj tells what happened
    cmEditor.on("change", (instance, changeObj) => {
        
        if(changeObj.origin === 'setValue')return;

        if(isUpdatingFromNetwork)
            return;
        
        // Raw text from the textbox
        const currentText = cmEditor.getValue();

        // Even though data is transmitted after some time, the keystrokes need to update instantly on the local side
        markdownOuput.innerHTML = marked.parse(currentText);
        
        pendingText = currentText;
        
        if(!isTimerRunning) {
            isTimerRunning = true;


            // JS works asynchronously and if the wouldn't have isTimerRunning, the timeout could be ran multiple times
            setTimeout( () => {
                
                if(socket.readyState === WebSocket.OPEN && pendingText !== null) {
                    const syncMessage = {
                        type: "sync",
                        docId: docId,
                        text: pendingText
                    };
                    
                    try {
                        socket.send(JSON.stringify(syncMessage));
                    }
                    catch (error) {
                        console.log("Couldn't send the sync JSON message");
                        console.log(syncMessage);
                        console.log(error);
                        alert("Couldn't send the sync JSON message")
                        return;
                    }
                }

                isTimerRunning = false;
                pendingText = null;

            }, 100); // milliseconds 
        }
        
    });







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








});


