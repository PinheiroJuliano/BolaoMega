const API = 'https://bolaomega-production.up.railway.app/';

function authHeader() {
    const token = localStorage.getItem('token');

    if (!token) {
        return {};
    }

    return {
        Authorization: 'Bearer ' + token
    };
}