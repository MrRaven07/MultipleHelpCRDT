


App.Utils.generateUser = () => {
    const adjectives = [
        'Glitchy', 'Overclocked', 'Laggy', 'Deprecated', 'Headless', 'Throttled', 'Bootlooping',
        'Pixelated', 'Encrypted', 'Buggy', 'Hardcoded', 'Bypassed', 'Frozen', 'Bricked',
        'Zipped', 'Cached', 'Caffeinated', 'Derpy', 'Sweaty', 'Chunky', 'Sweetie', 'Wobbly',
        'Squeaky', 'Grumpy', 'Fluffy', 'Majestic', 'Awkward', 'DJ', 'MC', 'Snarky', 'Jittery',
        'Panicking', 'Soggy', 'Crusty', 'Wacky', 'Bouncy', 'Sneaky', 'Dizzy', 'Slimy',
        'Lopsided', 'Noodly', 'Radioactive', 'Sputtering', 'Screaming', 'Leaky', 'Smelly',
        'Dazzling', 'Baffled', 'Giggling', 'Moisty', 'Jumbled'
    ];
    
    const nouns = [
        'Docker', 'Battery', 'USB', 'Dongle', 'Bug', 'Server', 'Router', 'Keyboard',
        'Algorithm', 'Cache', 'Cookie', 'Motherboard', 'Floppy', 'Pixel', 'Repo',
        'Firewall', 'Database', 'Packet', 'Modem', 'Syntax', 'Terminal', 'Kernel',
        'Sandbox', 'Compiler', 'Byte', 'Framework', 'Node', 'Socket', 'Cloud',
        'Malware', 'Exception', 'Pointer', 'Stack', 'Capacitor', 'Transistor',
        'Penguin', 'Sloth', 'Badger', 'Wombat', 'Platypus', 'Weasel', 'Alpaca',
        'Capybara', 'Lemur', 'Meerkat', 'Opossum', 'Otter', 'Raccoon', 'Walrus', 'Yeti',
        'Predator'
    ];
    
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const toHex = (num) => num.toString(16).padStart(2, '0');

    const randomColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    const randomNumber = Math.floor(Math.random() * 900) + 100;

    return {
        id: `${randomAdj}${randomNoun}${randomNumber}`,
        color: randomColor
    };
};



App.Utils.createCursorSpan = (color) => {
    const cursorElement = document.createElement('span');
    cursorElement.className = 'remote-cursor';
    cursorElement.style.borderLeft = `2px solid ${color || '#000000'}`;
    cursorElement.style.height = '1.2em';
    cursorElement.style.display = 'inline-block';
    return cursorElement;
}

