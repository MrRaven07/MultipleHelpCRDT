

const createRoomBtn = document.getElementById('createRoomBtn');
createRoomBtn.addEventListener('click', () => {

    /* Math.random() creates a number between 0 and 1, ex: 0.871928374 */
    /* .toString(36) converts the number into the base36, which includes 0-9 and a-z, so the decimal number turns into something like: 0.kx2p9z */
    /* .substring(2, 9) skips the first 2 characters, "0." */
    const randomDocId = "doc_" + Math.random().toString(36).substring(2, 9);

    /* window.location.href tells the browser to change the URL and load a new page */
    /* the backticks ` allow to put the formatted text with ${} */
    window.location.href = `editor.html?doc=${randomDocId}`;

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


function loadRecentRooms() {
    const historyList = document.getElementById('historyList');
    let foundRooms = false;

    for (let i = 0 ; i < localStorage.length; i++) {

        const key = localStorage.key(i);

        if (key.startsWith('doc_')) {
            foundRooms = true;

            const link = document.createElement('a');
            link.href = `editor.html?doc=${key}`
            link.innerText = `Resume: ${key}`
            
            historyList.appendChild(link);
        }
    }

    if (!foundRooms) {
        historyList.innerHTML = "<p style='color: rgba(255, 104, 104, 0.5);'>No locally saved rooms found.</p>"
    }
}


    
loadRecentRooms();









