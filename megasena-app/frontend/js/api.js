const API = 'https://bolaomega-production.up.railway.app/';

function authHeader() {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('Token não encontrado');
    }

    return {
        Authorization: 'Bearer ' + token
    };
}
