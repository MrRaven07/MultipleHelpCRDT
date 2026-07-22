




App.Network.init = () => {
    App.socket = new WebSocket('ws://localhost:7053');

    // When the connection opens
    App.socket.onopen = () => {
        alert(`Connected to the server. Room: ${App.State.docId}`);
        
        // sending the join message
        const joinMessage = { 
            type: 'join', 
            docId: App.State.docId, 
            text: App.State.pendingText 
        };
        try { 
            App.socket.send(JSON.stringify(joinMessage)); 
        }
        catch (error) { 
            alert("The JSON transmitted was invalid"); 
            return; 
        }
    };


    // When a message has been received from the server
    App.socket.onmessage = (event) => {
        let incomingData;
        try { 
            incomingData = JSON.parse(event.data); 
        }
        catch (error) { 
            alert("The JSON received was invalid"); 
            return; 
        }

        // sync/update the text
        if (incomingData.type === 'sync') {
            App.State.isUpdatingFromNetwork = true;
            App.cmEditor.setValue(incomingData.text);
            document.getElementById('markdownOutput').innerHTML = marked.parse(incomingData.text);
            App.State.isUpdatingFromNetwork = false;            
        }

        // when another users moves the cursor
        if (incomingData.type === 'sync_cursor') {
            // Object destructuring
            const { userId, position, timestamp, color } = incomingData;

            // Object destructuring solves the following chunk
            // const userId = incomingData.userId;
            // const position = incomingData.position;
            // const timestamp = incomingData.timestamp;
            // const color = incomingData.color;


            // Ignoring the cursor of the same machine (even though the server verifies the ) 
            if (userId === App.State.myUserDetails.id) 
                return;

            
            // If the user cursor doesn't yet exist 
            // or 
            // the timestamp is smaller than the one received
            if (!App.State.cursorMapLWW[userId] || App.State.cursorMapLWW[userId].timestamp < timestamp) {

                // if this user already exists 
                // and
                // has a cursor on the screen, it will be removed
                if (App.State.cursorMapLWW[userId] && App.State.cursorMapLWW[userId].marker) {
                    App.State.cursorMapLWW[userId].marker.clear();
                }

                const cursorElement = document.createElement('span');
                cursorElement.className = 'remote-cursor';
                cursorElement.style.borderLeft = `2px solid ${color || '#ff0000'}`;
                cursorElement.style.height = '1.2em';
                cursorElement.style.display = 'inline-block';

                const newMarker = App.cmEditor.setBookmark(position, { widget: cursorElement });
                
                App.State.cursorMapLWW[userId] = { 
                    timestamp: timestamp, 
                    marker: newMarker 
                };
            }
        }
    };


    // When the socket closes
    App.socket.onclose = () => {
        console.warn("The server is inactive");
        alert("The server is inactive, try to reload the page");
    };
};