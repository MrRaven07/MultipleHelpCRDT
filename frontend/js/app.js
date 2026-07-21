
// Added this part that checks first if all the HTML parts were loaded first
// in order that we can return from it if some things go wrong
document.addEventListener('DOMContentLoaded', () => {



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


    // In case of a message is received from the server
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

        // sync message
        if (incomingData.type === 'sync'){
            
            isUpdatingFromNetwork = true;

            cmEditor.setValue(incomingData.text);
            markdownOuput.innerHTML = marked.parse(incomingData.text);

            isUpdatingFromNetwork = false;            
        }
    };

    // In case that the servers crashes
    socket.onclose = () => {
        console.warn("The server is inactive");
        alert("The server is inactive, try to reload the page");
    };


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

            }, 500); // 500 milliseconds 
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


