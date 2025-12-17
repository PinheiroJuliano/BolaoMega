const API = 'http://localhost:3000';

function authHeader() {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('Token não encontrado');
    }

    return {
        Authorization: 'Bearer ' + token
    };
}
