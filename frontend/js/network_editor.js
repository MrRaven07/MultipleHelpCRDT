

App.Network.init = () => {
    App.socket = new WebSocket('ws://localhost:7053');

    // When the connection opens
    App.socket.onopen = () => {
        
        alert(`Connected to the server. Room: ${App.State.docId}`);


        // sending the join message
        const joinMessage = { 
            type: 'join', 
            docId: App.State.docId, 
            userId: App.State.myUserDetails.id,
            color: App.State.myUserDetails.color 
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


        if (incomingData.type === 'join') {
            if (incomingData.userId === App.State.myUserDetails.id)
                return;

            App.State.activeUsers.set(incomingData.userId,  {
                id: incomingData.userId,
                color: incomingData.color 
            });
            App.Editor.updateRosterUI();

            const presenceMsg = {
                type: 'presence',
                docId: App.State.docId,
                userId: App.State.myUserDetails.id,
                color: App.State.myUserDetails.color,
                keystrokes: App.State.numberKeystrokesGCounter[App.State.myUserDetails.id]
            };

            try { 
                App.socket.send(JSON.stringify(presenceMsg)); 
            }
            catch (error) { 
                alert("The JSON presence data transmitted was invalid"); 
                return; 
            }

        }


        if(incomingData.type === 'presence') {

            // if the sender is also the receiver, that being self
            if(incomingData.userId === App.State.myUserDetails.id)
                return;

            App.State.activeUsers.set(incomingData.userId, {
                id: incomingData.userId,
                color: incomingData.color
            });


            if(!App.State.numberKeystrokesGCounter){
                App.State.numberKeystrokesGCounter = {};
            }

            const incomingCount = incomingData.keystrokes || 0;
            const localCount = App.State.numberKeystrokesGCounter[incomingData.userId] || 0;

            App.State.numberKeystrokesGCounter[incomingData.userId] = Math.max(localCount, incomingCount);


            App.Editor.updateRosterUI();

        }


        
        // sync/update the text
        if (incomingData.type === 'sync') {
            // if the sender is also the receiver, that being self
            if(incomingData.userId === App.State.myUserDetails.id)
                return;
            
            App.State.isUpdatingFromNetwork = true;

            const localCursor = App.cmEditor.getCursor();

            App.cmEditor.setValue(incomingData.text);

            App.cmEditor.setCursor(localCursor);
            
            for(const [userId, data] of Object.entries(App.State.cursorMapLWW)){
                const cursorElement = App.Utils.createCursorSpan(data.color);

                const newMarker = App.cmEditor.setBookmark(data.lastPos, {widget: cursorElement});
                App.State.cursorMapLWW[userId].marker = newMarker;
            }



            document.getElementById('markdownOutput').innerHTML = marked.parse(incomingData.text);
            App.State.isUpdatingFromNetwork = false;            

            const incomingId = incomingData.userId;
            const incomingCount = incomingData.keystrokes;

            const localCount = App.State.numberKeystrokesGCounter[incomingId] || 0;

            App.State.numberKeystrokesGCounter[incomingId] = Math.max(localCount, incomingCount);

            App.Editor.updateRosterUI();
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
                
                const cursorElement = App.Utils.createCursorSpan(color);

                
                const newMarker = App.cmEditor.setBookmark(position, { widget: cursorElement });
                
                App.State.cursorMapLWW[userId] = { 
                    timestamp: timestamp, 
                    marker: newMarker,
                    color: color || '#000000',
                    lastPos: position
                };
            }
        }



        if(incomingData.type === 'leave') {
            App.State.activeUsers.delete(incomingData.userId);

            if(App.State.cursorMapLWW[incomingData.userId]){
                if (App.State.cursorMapLWW[incomingData.userId].marker)
                    App.State.cursorMapLWW[incomingData.userId].marker.clear();
                delete App.State.cursorMapLWW[incomingData.userId]
            }
            
            App.Editor.updateRosterUI();
            
        }


    };
    
    
    // When the socket closes
    App.socket.onclose = () => {
        console.warn("The server is inactive");
        alert("The server is inactive, try to reload the page");
    };


    window.addEventListener('beforeunload', () => {
        if(App.socket.readyState === WebSocket.OPEN) {
            const leaveMsg = {
                type: 'leave',
                docId: App.State.docId,
                userId: App.State.myUserDetails.id
            };
            try { 
                App.socket.send(JSON.stringify(leaveMsg)); 
            }
            catch (error) { 
                alert("The JSON leave data transmitted was invalid"); 
                return; 
            }
        }
    });
    


};