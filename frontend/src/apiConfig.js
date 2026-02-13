const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : `http://${window.location.hostname}:5000`; // Support for local IP access

export default API_BASE_URL;
