        const colorPicker = document.getElementById("colorPicker");
        const bgClrPicker = document.getElementById("bgClrPicker");
        const canvas = document.getElementById("myCanvas");
        const clrBtn = document.getElementById("clearBtn");
        const saveBtn = document.getElementById("saveBtn");
        const fontPicker = document.getElementById("fontSize");
        const retrieveBtn = document.getElementById("retrieveBtn");

        const ctx = canvas.getContext('2d');
        
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        // Change stroke and fill style based on color picker
        colorPicker.addEventListener('change', (e) => {
            ctx.strokeStyle = e.target.value;
            ctx.fillStyle = e.target.value;
        });

        // Start drawing
        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            lastX = e.offsetX;
            lastY = e.offsetY;
        });

        // Draw lines on canvas
        canvas.addEventListener('mousemove', (e) => {
            if (isDrawing) {
                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.stroke();

                lastX = e.offsetX;
                lastY = e.offsetY;
            }
        });

        // Stop drawing
        canvas.addEventListener('mouseup', () => {
            isDrawing = false;
        });

        // Change background color
        bgClrPicker.addEventListener('change', (e) => {
            ctx.fillStyle = e.target.value;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });

        // Clear the canvas
        clrBtn.addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });

    saveBtn.addEventListener('click', () => {
    const dataURL = canvas.toDataURL(); // Convert the canvas content to a data URL
    localStorage.setItem('canvasContents', dataURL); // Save the data URL to localStorage

    // Trigger download as an image file
    const link = document.createElement('a');
    link.download = 'signature.png';
    link.href = dataURL;
    link.click();
});

retrieveBtn.addEventListener('click', () => {
    let saved = localStorage.getItem('canvasContents');
    if (saved) {
        let img = new Image();
        img.src = saved;
        img.onload = () => { // Wait for the image to load
            ctx.drawImage(img, 0, 0);
        };
    } else {
        alert("No saved signature found!");
    }
});