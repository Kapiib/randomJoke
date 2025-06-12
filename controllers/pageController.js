const pageController = {
    // Render the user guide page
    renderGuide: (req, res) => {
        try {
            res.render('guide');
        } catch (error) {
            console.error('Error rendering user guide:', error);
            res.status(500).send('Kunne ikke laste brukerveiledningen');
        }
    },
    
    // Test rate limit endpoint
    testRateLimit: (req, res) => {
        console.log(`Test rate limit accessed at ${new Date().toISOString()}`);
        res.json({ 
            success: true, 
            message: 'This route is rate limited', 
            time: new Date().toISOString() 
        });
    }
};

module.exports = pageController;