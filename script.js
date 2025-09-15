// Global variables to store winning and redeemed codes
let winningCodes = [];
let redeemedCodes = [];

// Function to load codes from localStorage
function loadCodes() {
    const storedWinningCodes = localStorage.getItem('winningCodes');
    const storedRedeemedCodes = localStorage.getItem('redeemedCodes');

    winningCodes = storedWinningCodes ? JSON.parse(storedWinningCodes) : [];
    redeemedCodes = storedRedeemedCodes ? JSON.parse(storedRedeemedCodes) : [];
}

// Function to save codes to localStorage
function saveCodes() {
    localStorage.setItem('winningCodes', JSON.stringify(winningCodes));
    localStorage.setItem('redeemedCodes', JSON.stringify(redeemedCodes));
}

// Function to handle player code submission
function handlePlayerCodeSubmission() {
    const codeInput = document.getElementById('codeInput');
    const resultMessage = document.getElementById('resultMessage');
    const videoPlayer = document.getElementById('videoPlayer');
    const videoSource = document.getElementById('videoSource');
    const videoContainer = document.getElementById('videoContainer');

    const code = codeInput.value.trim(); //Trim Whitespace

    // Error Checking
    if (code === '') {
        resultMessage.textContent = "Please enter a code.";
        setTimeout(() => {
                resultMessage.textContent = ""; // Reset message after 5 seconds
            }, 5000);
        codeInput.value = ''; // Clear input field
        return; // Exit the function if input is empty
    }

    if (code.length !== 3) {
        resultMessage.textContent = "Code must be exactly 3 digits long.";
        setTimeout(() => {
                resultMessage.textContent = ""; // Reset message after 5 seconds
            }, 5000);
        codeInput.value = ''; // Clear input field
        return; // Exit the function if input length is incorrect
    }

    if (!/^\d{3}$/.test(code)) { // Check for exactly 4 digits
        resultMessage.textContent = "Code must be a 3-digit number.";
        setTimeout(() => {
                resultMessage.textContent = ""; // Reset message after 5 seconds
            }, 5000);
        codeInput.value = ''; // Clear input field
        return; // Exit the function if input format is incorrect
    }
    
    // **NEW: Get the current skin from the body class**
    const currentSkin = document.body.className; // Get the current skin class

    // **NEW: Define winning and losing videos for each skin**
    const videos = {
        ord: {
            winning: 'ORD Winner Video.mp4',
            losing: 'ORD Losing Video.mp4' 
        },
        rehab: {
            winning: 'RM Winning Video (RM).mp4',
            losing: 'RM Losing Video (RM).mp4' 
        },
        livebig: {
            winning: 'LB Winning Video.mp4',
            losing: 'LB Losing Video.mp4'
        }
    };

    // Check if the code is a winning code
    if (winningCodes.includes(code)) {
        if (!redeemedCodes.includes(code)) {
            redeemedCodes.push(code); // Mark code as redeemed
            videoSource.src = videos[currentSkin].winning; // **Updated to use skin-specific winning video**
            videoContainer.style.display = 'block';
            videoPlayer.load();
            videoPlayer.play();
        } else {
            resultMessage.textContent = "This code has already been redeemed.";
            setTimeout(() => {
                resultMessage.textContent = ""; // Reset message after 5 seconds
            }, 5000);
        }
    } else {
        redeemedCodes.push(code); // Mark Code as redeemed
        videoSource.src = videos[currentSkin].losing; // **Updated to use skin-specific losing video**
        videoContainer.style.display = 'block';
        videoPlayer.load();
        videoPlayer.play();
        }

    // Clear input field
    codeInput.value = '';
    saveCodes(); // Save updated redeemed codes

// Request full screen when the video starts playing
    videoPlayer.addEventListener('play', () => {
        if (videoPlayer.requestFullscreen) {
            videoPlayer.requestFullscreen();
        } else if (videoPlayer.webkitRequestFullscreen) { // Safari
            videoPlayer.webkitRequestFullscreen();
        } else if (videoPlayer.msRequestFullscreen) { // IE11
            videoPlayer.msRequestFullscreen();
        }
    });

    // Reset video source and hide container when video ends
    videoPlayer.addEventListener('ended', () => {
        // Exit full screen if in full screen mode
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else if (document.webkitFullscreenElement) { // Safari
            document.webkitExitFullscreen();
        } else if (document.msFullscreenElement) { // IE11
            document.msExitFullscreen();
        }

        videoContainer.style.display = 'none';
        videoSource.src = ''; // Reset video source
    });
}

// Function to add a winning code
function addWinningCode() {
    const newCodeInput = document.getElementById('newCodeInput');
    const newCode = newCodeInput.value;

    if (newCode.length === 3 && !winningCodes.includes(newCode)) {
        winningCodes.push(newCode);
        updateWinningCodesList();
        newCodeInput.value = ''; // Clear input field
        saveCodes(); // Save updated winning codes
    } else {
        alert("Invalid code or code already exists.");
    }
}

// Function to remove a winning code
function removeWinningCode() {
    const newCodeInput = document.getElementById('newCodeInput');
    const codeToRemove = newCodeInput.value;

    if (winningCodes.includes(codeToRemove)) {
        winningCodes = winningCodes.filter(code => code !== codeToRemove);
        updateWinningCodesList();
        newCodeInput.value = ''; // Clear input field
        saveCodes(); // Save updated winning codes
    } else {
        alert("Code not found.");
    }
}

// Function to update the displayed list of winning codes
function updateWinningCodesList() {
    const winningCodesList = document.getElementById('winningCodesList');
    winningCodesList.innerHTML = ''; // Clear existing list

    winningCodes.forEach(code => {
        const li = document.createElement('li');
        li.textContent = code;
        winningCodesList.appendChild(li);
    });

    // Update redeemed codes list
    updateRedeemedCodesList();
}

// Function to update the displayed list of redeemed codes
function updateRedeemedCodesList() {
    const redeemedCodesList = document.getElementById('redeemedCodesList');
    redeemedCodesList.innerHTML = ''; // Clear existing list

    redeemedCodes.forEach(code => {
        const li = document.createElement('li');
        li.textContent = code;
        redeemedCodesList.appendChild(li);
    });
}

// Function to reset the round
function resetRound() {
    winningCodes = []; // Clear winning codes
    redeemedCodes = []; // Clear redeemed codes
    saveCodes(); // Save the empty arrays to localStorage
    updateWinningCodesList(); // Update the displayed list
    updateRedeemedCodesList(); // Update the displayed list
    alert("The round has been reset."); // Notify the user
}

// Event listeners for player and admin actions
document.addEventListener('DOMContentLoaded', () => {
    loadCodes(); // Load codes from localStorage

   // Check if we are on the players page
    if (document.getElementById('codeInput')) {
        document.getElementById('submitBtn').addEventListener('click', handlePlayerCodeSubmission);

        // Add event listener for the Enter key in the input field
        const codeInput = document.getElementById('codeInput');
        codeInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') { // Check if the pressed key is Enter
                event.preventDefault(); // Prevent the default action (form submission)
                handlePlayerCodeSubmission(); // Call the submit function
            }
        });
    }

    // Check if we are on the admin page
    if (document.getElementById('newCodeInput')) {
        document.getElementById('addCodeBtn').addEventListener('click', addWinningCode);
        document.getElementById('removeCodeBtn').addEventListener('click', removeWinningCode);

        // Add event listener for the reset round button
        document.getElementById('resetRoundBtn').addEventListener('click', resetRound)
    }

    // Update the lists on page load
    updateWinningCodesList();
    updateRedeemedCodesList();
});
