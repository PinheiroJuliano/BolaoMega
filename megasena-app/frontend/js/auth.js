async function register() {
    await fetch(API + 'auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name.value,
            email: email.value,
            password: password.value,
            phone: phone.value,
            address: address.value
        })
    });
    location.href = 'login.html';
}

async function login() {
    const res = await fetch(`${API}auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    });

    const data = await res.json();
    console.log(data);
    localStorage.setItem('token', data.token);
    window.location.href = 'app.html';
}