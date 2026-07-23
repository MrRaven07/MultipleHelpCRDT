


App.Menu.loadRecentRooms = () => {
    const historyList = document.getElementById('historyList');


    let rooms = [];

    for (let i = 0 ; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('doc_')) {
            const timestamp = parseInt(localStorage.getItem(key)) || 0;
            rooms.push({id: key, time: timestamp});
        }
    }

    rooms.sort((a,b) => b.time - a.time);

    const topRooms = rooms.slice(0, 5);
    const garbageRooms = rooms.slice(7);

    garbageRooms.forEach(room => {
        localStorage.removeItem(room.id);
    });

    
    if (topRooms.length === 0){
        historyList.innerHTML = "<p style='color: rgba(255, 104, 104, 0.5);'>No locally saved rooms found.</p>";
    }
    else {
        historyList.innerHTML = '';
        topRooms.forEach(room => {
            const link = document.createElement('a');
            link.href = `editor.html?doc=${room.id}`
            link.innerText = `Resume: ${room.id}`

            link.className = 'history-link';
            historyList.appendChild(link);
        });

    }

};




App.Menu.init = () => {
    const createRoomBtn = document.getElementById('createRoomBtn');

    /* Math.random() creates a number between 0 and 1, ex: 0.871928374 */
    /* .toString(36) converts the number into the base36, which includes 0-9 and a-z, so the decimal number turns into something like: 0.kx2p9z */
    /* .substring(2, 9) skips the first 2 characters, "0." */
    createRoomBtn.addEventListener('click', () => {
        const randomDocId = "doc_" + Math.random().toString(36).substring(2, 9);
        /* window.location.href tells the browser to change the URL and load a new page */
        /* the backticks ` allow to put the formatted text with ${} */
        window.location.href = `editor.html?doc=${randomDocId}`;
    });



    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    clearHistoryBtn.addEventListener('click', () => {

        /* 
        Firstly, all the items that must be delete have to be included in a list
        This is done because if one deletes an item from localStorage, the rest of the list 
        will fill that space.
        */ 
        const keysToRemove = [];
        for(let i=0; i<localStorage.length; i++){
            const key = localStorage.key(i);
            if(key.startsWith('doc_')){
                keysToRemove.push(key);
            }
        }        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        App.Menu.loadRecentRooms();
    });


    const joinRoomBtn = document.getElementById('joinRoomBtn');
    const roomCodeInput = document.getElementById('roomCodeInput');

    joinRoomBtn.addEventListener('click', () => {
        const roomCode = roomCodeInput.value.trim();
        if (roomCode !== "") {
            const finalCode = roomCode.startsWith('doc_') ? roomCode : `doc_${roomCode}`;
            window.location.href = `editor.html?doc=${finalCode}`;
        } 
        else {
            alert('Please enter a room code first');
        }
    });

    App.Menu.loadRecentRooms();
};



// Start the menu immediately when this file loads
App.Menu.init();



