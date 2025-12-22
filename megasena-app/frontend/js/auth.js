async function register() {
    const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            phone: document.getElementById('phone')?.value || null,
            address: document.getElementById('address')?.value || null
        })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.error);
        return;
    }

    window.location.href = 'login.html';
}
async function login(event) {
    event.preventDefault();

    const res = await fetch(`${API}auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.error || 'Login inválido');
        return;
    }

    localStorage.setItem('token', data.token);
    window.location.href = 'app.html';
}