document.addEventListener('DOMContentLoaded', () => {
    const setupElement = document.getElementById('joke-setup');
    const punchlineElement = document.getElementById('joke-punchline');
    const newJokeBtn = document.getElementById('new-joke-btn');

    // Function to fetch a new joke
    const fetchNewJoke = async () => {
        try {
            const response = await fetch('/api/joke');
            if (!response.ok) {
                throw new Error('Nettverksfeil');
            }
            
            const joke = await response.json();
            
            // Update the joke on the page
            setupElement.textContent = joke.setup;
            punchlineElement.textContent = joke.punchline;
            
        } catch (error) {
            console.error('Feil ved henting av vits:', error);
            setupElement.textContent = 'Kunne ikke hente vitsen';
            punchlineElement.textContent = 'Prøv igjen senere';
        }
    };

    // Add event listener to the button
    newJokeBtn.addEventListener('click', fetchNewJoke);
});