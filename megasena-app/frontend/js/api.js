const API = 'https://bolaomega-production.up.railway.app';

function authHeader() {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`
    };
}
