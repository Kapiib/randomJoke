document.addEventListener('DOMContentLoaded', () => {
    const setupElement = document.getElementById('joke-setup');
    const punchlineElement = document.getElementById('joke-punchline');
    const newJokeBtn = document.getElementById('new-joke-btn');
    const stars = document.querySelectorAll('.star');
    const averageRatingDiv = document.getElementById('average-rating');
    const ratingConfirmation = document.getElementById('rating-confirmation');
    const avgValueSpan = document.getElementById('avg-value');
    const ratingCountSpan = document.getElementById('rating-count');
    const errorContainer = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const errorAction = document.getElementById('error-action');
    
    let currentJokeId = null;
    let currentRating = 0;
    let hasVoted = false;
    
    // Function to show error messages
    const showError = (message, action = '') => {
        errorText.textContent = message;
        errorAction.textContent = action;
        errorContainer.style.display = 'block';
        
        // Auto-hide error after 10 seconds
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 10000);
    };
    
    // Function to hide error message
    const hideError = () => {
        errorContainer.style.display = 'none';
    };
    
    // Function to reset stars and rating UI
    const resetStars = () => {
        stars.forEach(star => star.classList.remove('active'));
        currentRating = 0;
        newJokeBtn.disabled = true;
        hasVoted = false;
        averageRatingDiv.classList.add('hidden');
        ratingConfirmation.classList.add('hidden');
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
            
            // Hide any previous errors
            hideError();
            
            // Submit rating immediately
            const success = await submitRating(currentJokeId, value);
            
            if (success) {
                // Show confirmation message
                ratingConfirmation.classList.remove('hidden');
                
                // Enable the button after rating is submitted
                newJokeBtn.disabled = false;
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
            
            if (response.status === 429) {
                showError(
                    'For mange forespørsler. Systemet begrenser antall vurderinger for øyeblikket.', 
                    'Vennligst vent noen sekunder før du prøver igjen.'
                );
                return false;
            }
            
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
            showError(
                'Kunne ikke lagre vurderingen din.', 
                'Sjekk internettforbindelsen din og prøv igjen.'
            );
            return false;
        }
    };
    
    // Function to fetch a new joke
    const fetchNewJoke = async () => {
        try {
            // Hide any previous errors when fetching a new joke
            hideError();
            
            const response = await fetch('/api/joke');
            
            if (response.status === 429) {
                showError(
                    'For mange forespørsler. Systemet begrenser antall vitser for øyeblikket.', 
                    'Vennligst vent noen sekunder før du prøver igjen.'
                );
                return;
            }
            
            if (!response.ok) {
                throw new Error('Nettverksfeil');
            }
            
            const joke = await response.json();
            currentJokeId = joke.id;
            
            // Check if joke data is valid
            if (!joke.setup || !joke.punchline) {
                showError(
                    'Den hentede vitsen er ikke komplett.',
                    'Prøv å laste inn en ny vits.'
                );
                // Still show whatever we received
            }
            
            // Update the joke on the page
            setupElement.textContent = joke.setup || 'Manglende vits...';
            punchlineElement.textContent = joke.punchline || 'Manglende punchline...';
            
            // Reset stars for new joke
            resetStars();
            
        } catch (error) {
            console.error('Feil ved henting av vits:', error);
            showError(
                'Kunne ikke hente en ny vits.', 
                'Sjekk internettforbindelsen din og prøv igjen senere.'
            );
            setupElement.textContent = 'Nettverksproblemer';
            punchlineElement.textContent = 'Kunne ikke hente vits fra serveren';
        }
    };

    // Add event listener to the button
    newJokeBtn.addEventListener('click', () => {
        fetchNewJoke();
    });
    
    // Use the server-provided joke and update the currentJokeId
    const jokeElement = document.querySelector('.joke-container');
    if (jokeElement) {
        currentJokeId = jokeElement.dataset.jokeId;
    }
});