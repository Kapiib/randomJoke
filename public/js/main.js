document.addEventListener('DOMContentLoaded', () => {
    const setupElement = document.getElementById('joke-setup');
    const punchlineElement = document.getElementById('joke-punchline');
    const newJokeBtn = document.getElementById('new-joke-btn');
    const stars = document.querySelectorAll('.star');
    const averageRatingDiv = document.getElementById('average-rating');
    const avgValueSpan = document.getElementById('avg-value');
    const ratingCountSpan = document.getElementById('rating-count');
    
    let currentJokeId = null;
    let currentRating = 0;
    let hasVoted = false;
    
    // Function to reset stars and rating UI
    const resetStars = () => {
        stars.forEach(star => star.classList.remove('active'));
        currentRating = 0;
        newJokeBtn.disabled = true;
        hasVoted = false;
        averageRatingDiv.classList.add('hidden');
    };
    
    // Handle star rating selection and immediate submission
    stars.forEach(star => {
        star.addEventListener('click', async () => {
            // Only allow rating if user hasn't voted yet
            if (hasVoted) return;
            
            const value = parseInt(star.dataset.value);
            currentRating = value;
            
            // Update visual appearance
            stars.forEach(s => {
                if (parseInt(s.dataset.value) <= value) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
            
            // Submit rating immediately
            const success = await submitRating(currentJokeId, value);
            
            if (success) {
                // Enable the button after rating is submitted
                newJokeBtn.disabled = false;
                // Keep button text consistent - no change
            }
        });
    });
    
    // Function to submit rating to server
    const submitRating = async (jokeId, rating) => {
        try {
            const response = await fetch('/api/rate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ jokeId, rating })
            });
            
            if (!response.ok) {
                throw new Error('Kunne ikke lagre vurdering');
            }
            
            // Get the average rating data from response
            const data = await response.json();
            
            // Display average rating
            avgValueSpan.textContent = data.average;
            ratingCountSpan.textContent = data.count;
            averageRatingDiv.classList.remove('hidden');
            
            // Mark that user has voted
            hasVoted = true;
            
            return true;
        } catch (error) {
            console.error('Feil ved lagring av vurdering:', error);
            return false;
        }
    };
    
    // Function to fetch a new joke
    const fetchNewJoke = async () => {
        try {
            const response = await fetch('/api/joke');
            if (!response.ok) {
                throw new Error('Nettverksfeil');
            }
            
            const joke = await response.json();
            currentJokeId = joke.id;
            
            // Update the joke on the page
            setupElement.textContent = joke.setup;
            punchlineElement.textContent = joke.punchline;
            
            // Reset stars for new joke
            resetStars();
            
        } catch (error) {
            console.error('Feil ved henting av vits:', error);
            setupElement.textContent = 'Kunne ikke hente vitsen';
            punchlineElement.textContent = 'Prøv igjen senere';
        }
    };

    // Add event listener to the button
    newJokeBtn.addEventListener('click', () => {
        fetchNewJoke();
    });
    
    // Instead, just use the server-provided joke and update the currentJokeId
    const jokeElement = document.querySelector('.joke-container');
    if (jokeElement) {
        currentJokeId = jokeElement.dataset.jokeId;
    }
});