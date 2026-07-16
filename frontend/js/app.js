
document.addEventListener('DOMContentLoaded', () => {


    const editorInput = document.getElementById('editorInput');
    const markdownOuput = document.getElementById('markdownOutput');
    const backBtn = document.getElementById('backBtn');
    const importBtn = document.getElementById('importBtn');
    const saveBtn = document.getElementById('saveBtn');
    const fileImport = document.getElementById('fileImport');


    const urlParams = new URLSearchParams(window.location.search);
    const docId = urlParams.get('doc');


    console.log(urlParams)

    if (!docId) {
        alert(`The doc parameters ${window.location.search} is not alright, try to access a new room.`)
        window.location.href = 'index.html';
        return;        
    }

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

        // Markdown parser
        markdownOuput.innerText = currentText;


        // WebSocket broadcasting

    });


});


