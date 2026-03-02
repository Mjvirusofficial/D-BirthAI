const fetch = require('node-fetch');

const API_URL = 'http://localhost:5000/api/auth/user';
// Token captured from user logs
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk4ZWM4NzEwNTY2ZDk5MTVhM2M2NDAwIn0sImlhdCI6MTc3MDk5NDExOSwiZXhwIjoxNzcxMzU0MTE5fQ.6mGf00WHTru2Pot-KCR1T4lv-mVw8uw7CkFAlygWuAE';

const checkUser = async () => {
    try {
        console.log('Fetching user with token...');
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'x-auth-token': TOKEN,
                'Content-Type': 'application/json'
            }
        });

        console.log('Status:', response.status);
        if (response.ok) {
            const data = await response.json();
            console.log('User Data:', JSON.stringify(data, null, 2));
        } else {
            console.log('Error:', await response.text());
        }
    } catch (err) {
        console.error('Fetch Error:', err);
    }
};

checkUser();
