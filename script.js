// ================= AUTH =================
function register() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.find(u => u.email === email)) {
        alert('Usuário já existe');
        return;
    }

    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Cadastro realizado!');
}

function login() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        alert('Login inválido');
        return;
    }

    localStorage.setItem('loggedUser', email);
    showApp();
}

function logout() {
    localStorage.removeItem('loggedUser');
    location.reload();
}

function showApp() {
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('appContainer').style.display = 'block';
    listarJogosSalvos();
}

if (localStorage.getItem('loggedUser')) {
    showApp();
}

// ================= MEGA SENA =================
let jogosGerados = [];

function limparJogos() {
    document.getElementById('result').innerHTML = '';
    jogosGerados = [];
}

document.getElementById('cleanButton').addEventListener('click', limparJogos);

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gerarJogo() {
    let set = new Set();
    while (set.size < 6) {
        set.add(getRandom(1, 60));
    }
    return [...set].sort((a,b)=>a-b);
}

function gerarEExibirJogos() {
    let qtd = parseInt(document.getElementById('numJogos').value);
    let result = document.getElementById('result');
    result.innerHTML = '';
    jogosGerados = [];

    for (let i = 0; i < qtd; i++) {
        let jogo = gerarJogo();
        jogosGerados.push(jogo);

        let div = document.createElement('div');
        div.innerHTML = `Jogo ${i+1}: <strong>${jogo.join(', ')}</strong>`;
        result.appendChild(div);
    }

    if (jogosGerados.length) {
        let btn = document.createElement('button');
        btn.textContent = 'Salvar Jogos';
        btn.onclick = salvarJogos;
        result.appendChild(btn);
    }
}

document.getElementById('generateButton')
    .addEventListener('click', gerarEExibirJogos);

// ================= SALVAR / LISTAR =================
function salvarJogos() {
    let nome = prompt('Nome do jogo:');
    if (!nome) return;

    let saved = JSON.parse(localStorage.getItem('savedGames')) || [];
    saved.push({
        id: Date.now(),
        user: localStorage.getItem('loggedUser'),
        nome,
        data: new Date().toLocaleDateString(),
        jogos: jogosGerados
    });

    localStorage.setItem('savedGames', JSON.stringify(saved));
    listarJogosSalvos();
}

function listarJogosSalvos() {
    let container = document.getElementById('savedGames');
    let saved = JSON.parse(localStorage.getItem('savedGames')) || [];
    let user = localStorage.getItem('loggedUser');

    container.innerHTML = '';

    saved.filter(s => s.user === user).forEach(game => {
        let div = document.createElement('div');
        div.innerHTML = `
            <strong>${game.nome}</strong> (${game.data})<br>
            ${game.jogos.map(j => j.join(', ')).join('<br>')}
            <br>
            <button onclick="renomear(${game.id})">Renomear</button>
            <button onclick="excluir(${game.id})">Excluir</button>
        `;
        container.appendChild(div);
    });
}

function excluir(id) {
    let saved = JSON.parse(localStorage.getItem('savedGames'));
    saved = saved.filter(g => g.id !== id);
    localStorage.setItem('savedGames', JSON.stringify(saved));
    listarJogosSalvos();
}

function renomear(id) {
    let nome = prompt('Novo nome:');
    if (!nome) return;

    let saved = JSON.parse(localStorage.getItem('savedGames'));
    let game = saved.find(g => g.id === id);
    game.nome = nome;

    localStorage.setItem('savedGames', JSON.stringify(saved));
    listarJogosSalvos();
}
