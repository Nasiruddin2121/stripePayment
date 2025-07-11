require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
const app = express();

// Add middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.post('/checkout', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({ 
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Node js and Express book'
                        },
                        unit_amount: 50 * 100
                    },
                    quantity: 1
                },
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Java Script T-Shirt'
                        },
                        unit_amount: 20 * 100
                    },
                    quantity: 3
                }
            ],
            mode: 'payment',
            shipping_address_collection: {
                allowed_countries: ['US', 'BD']
            },
            success_url: 'http://localhost:3000/complete',
            cancel_url: 'http://localhost:3000/cancel'
        });
        res.redirect(303, session.url);
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/complete', (req, res) => {
    res.send('Payment completed successfully!');
});

app.get('/cancel', (req, res) => {
    res.send('Payment was canceled.');
});

app.listen(3000, () => console.log('Server started on port 3000'));