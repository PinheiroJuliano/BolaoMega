const token = localStorage.getItem('token');

if (!token) {
    location.href = 'login.html';
}

// Protege a rota
if (!localStorage.getItem('token')) {
    location.href = 'login.html';
}

// Função logout
function logout() {
    localStorage.removeItem('token');
    location.href = 'login.html';
}

// Geração de jogos
let jogosGerados = [];

function gerarJogos() {
    const qtd = Number(document.getElementById('numJogos').value);
    const result = document.getElementById('result');
    result.innerHTML = '';
    jogosGerados = [];

    for (let i = 0; i < qtd; i++) {
        const jogo = gerarJogo();
        jogosGerados.push(jogo);

        const div = document.createElement('div');
        div.innerHTML = `Jogo ${i + 1}: <strong>${jogo.join(', ')}</strong>`;
        result.appendChild(div);
    }

    if (jogosGerados.length) {
        const btn = document.createElement('button');
        btn.textContent = 'Salvar Jogos';
        btn.onclick = () => {
            const nome = prompt('Nome do jogo:');
            if (nome) salvarJogos(nome, jogosGerados);
        };
        result.appendChild(btn);
    }

    listarJogos();
}

// Funções auxiliares
function gerarJogo() {
    const set = new Set();
    while (set.size < 6) {
        set.add(Math.floor(Math.random() * 60) + 1);
    }
    return [...set].sort((a, b) => a - b);
}

// Carrega jogos ao abrir a página
listarJogos();
