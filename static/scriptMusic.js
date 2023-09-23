

//Part 3: Choosing the Music

document.addEventListener("DOMContentLoaded", function () {
// Get a reference to the <select> element
const musicSelect = document.getElementById('music-select');
    
// Get a reference to the <audio> element
const audioPlayer = document.getElementById('background-audio');

// Add an event listener to the <select> element to listen for changes
musicSelect.addEventListener('change', function () {
    // Get the selected option's value (the URL of the audio file)
    const selectedMusic = musicSelect.value;

    if (selectedMusic == 'default'){
        audioPlayer.pause(); // Pause audio playback
    } else {

    // Update the <audio> element's source to the selected music
    audioPlayer.src = selectedMusic;

    // Play the audio
    audioPlayer.play();

    }
});

});