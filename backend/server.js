

const WebSocket = require('ws');


// Starting the server on port 7053
const wss = new WebSocket.Server({port: 7053});



// The list that will contain all the informations related to the rooms and the users/browsers
// as a map
const rooms = new Map()


console.log(`The WebSocket server is running on ws://localhost:7053`)


// runs on every new connection
wss.on('connection', (ws) => {

    console.log('A new client connected');

    // The room that the user will join must be stored, in order to clean it up later.
    let currentRoom = null;


    // runs on every new message
    ws.on('message', (rawData) => {

        const messageAsString = rawData.toString();

        // From raw text, to json (javascript object notation)
        let parsedMessage;
        try {
            parsedMessage = JSON.parse(messageAsString);
        }
        catch (error) {
            console.log('Received invalid JSON');
            return;
        }


        
        console.log(parsedMessage)

        
        // After parsing the message, the type of information can be checked

        // in case that an user tries to join
        if (parsedMessage.type == 'join') {
            currentRoom = parsedMessage.docId;
            
            // Add the room to the map if it doesn't exist yet.
            if(!rooms.has(currentRoom)){
                rooms.set(currentRoom, new Set());
            }
            
            rooms.get(currentRoom).add(ws);
            console.log(`Client joined room: ${currentRoom}. Total users in room: ${rooms.get(currentRoom).size}`);
            
        }

        // in case that an user tries to synchronize
        else if (parsedMessage.type == 'sync'){
            
            // if the user tries to send data without joining a room, return
            if(!currentRoom)return;

            // pulling the user from the room
            const usersInRoom = rooms.get(currentRoom);

            // loop through everyone in the map
            usersInRoom.forEach( (client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN)
                    // Send the data as how it was received 
                    client.send(messageAsString); 
            });
        }

    });




    ws.on('close', () => {
        if (currentRoom && rooms.has(currentRoom)){
            const usersInRoom = rooms.get(currentRoom);
            usersInRoom.delete(ws);
            console.log(`A client left the room: ${currentRoom}, remaining: ${usersInRoom.size}`);

            if (usersInRoom.size === 0){
                rooms.delete(currentRoom);
                console.log(`The room ${currentRoom} was empty and has been deleted`);
            }

        }
    });

});





