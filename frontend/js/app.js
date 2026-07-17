
// Added this part that checks first if all the HTML parts were loaded first
// in order that we can return from it if some things go wrong
document.addEventListener('DOMContentLoaded', () => {


    const editorInput = document.getElementById('editorInput');
    const markdownOuput = document.getElementById('markdownOutput');
    const backBtn = document.getElementById('backBtn');
    const importBtn = document.getElementById('importBtn');
    const saveBtn = document.getElementById('saveBtn');
    const fileImport = document.getElementById('fileImport');


    const urlParams = new URLSearchParams(window.location.search);
    const docId = urlParams.get('doc');


    let alerted = false;

    if (!docId) {
        alert(`The doc parameters ${window.location.search} is not alright, try to access a new room.`)
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
            docId: docId
        };

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
            return;
        }

        console.log(`The JSON received: ${incomingData}`)        

        // sync message
        if (incomingData.type == 'sync'){
            console.log(`Received data from the server: ${incomingData}`);
            markdownOuput.innerText = incomingData.text;
            editorInput.innerTest = incomingData.text;
        }
    };

    // In case that the servers crashes
    socket.onclose = () => {
        console.warn("The server is inactive");
        alert("The server is inactive, try to reload the page");
    };









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


    // Gets activated every time the text box changes
    editorInput.addEventListener('input', () => {
        const currentText = event.target.value;


        if (socket.readyState === WebSocket.OPEN){
            const syncMessage = {
                type: 'sync',
                docId: docId,
                text: currentText
            };

            try {
                let jsonifiedMessage = JSON.stringify(syncMessage);
                socket.send(jsonifiedMessage);
                console.log(`The json sent: ${jsonifiedMessage}`);
            }
            catch (error) {
                console.log(`Couldn't sent the json message`);
                return;
            }
            


        }
        else if (alerted === false) {
            alert("The server is inactive, try to reload the page. What you typed will only be stored locally.");
            alerted = true;
        }
        markdownOuput.innerText = currentText;
        editorInput.innerText = currentText;
        
        // Markdown parser
        

    });


});


