

// The SINGLE global variable that will be used for the entire application

const App = {
    // Aplication state (Shared variables)
    State: {
        myUserDetails: null,
        cursorMapLWW: {},
        activeUsers: new Map(),
        isUpdatingFromNetwork: false,
        pendingText: null,
        isTimerRunning: false,
        docId: new URLSearchParams(window.location.search).get('doc'),
        numberKeystrokesGCounter: {}
    },

    // Global Core Objects
    socket: null,
    cmEditor: null,


    // Module Drawers (Will be filled by other files)
    Utils: {},
    Editor: {},
    Menu: {},
    Network: {}

};