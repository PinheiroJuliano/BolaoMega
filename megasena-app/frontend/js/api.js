const API = `${window.location.origin}/`;

function authHeader() {
    const token = localStorage.getItem('token');

    if (!token) {
        return {};
    }

    return {
        Authorization: 'Bearer ' + token
    };
}