if (!localStorage.getItem('token')) {
    location.href = 'login.html';
}

// SALVAR JOGOS
async function salvarJogos(nome, jogos) {
    const res = await fetch(API + 'games', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
        body: JSON.stringify({
            name: nome,
            numbers: jogos
        })
    });

    if (res.status === 401) {
        localStorage.removeItem('token');
        location.href = 'login.html';
        return;
    }

    listarJogos();
}

// LISTAR JOGOS
async function listarJogos() {
    const res = await fetch(API + 'games', {
        headers: authHeader()
    });

    if (res.status === 401) {
        localStorage.removeItem('token');
        location.href = 'login.html';
        return;
    }

    const games = await res.json();

    const container = document.getElementById('savedGames');
    container.innerHTML = '';

games.forEach(game => {
    const div = document.createElement('div');

div.innerHTML = `
<div class="game-card">
    <div class="game-info">
        <strong>${game.name}</strong> (${game.date})<br>
        ${game.numbers
            .map(j => j.join(', '))
            .join('<br>')}
        <br>
    </div>

    <div class="game-actions">
        <button class="btn-icon" onclick="editarJogo(${game.id}, '${game.name.replace(/'/g, "\\'")}')" title="Editar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"
                    fill="currentColor"/>
                <path d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42L18.37 3.29a1.003
                        1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.83z"
                    fill="currentColor"/>
            </svg>
        </button>

        <button class="btn-icon" onclick="excluirJogo(${game.id})" title="Excluir">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M6 7h12M9 7v10m6-10v10M4 7h16l-1 14H5L4 7zM9 4h6l1 3H8l1-3z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"/>
            </svg>
        </button>
    </div>
</div>
`;


    container.appendChild(div);
});

}

// EXCLUIR JOGO
async function excluirJogo(id) {
    const res = await fetch(API + 'games/' + id, {
        method: 'DELETE',
        headers: authHeader()
    });

    if (res.status === 401) {
        localStorage.removeItem('token');
        location.href = 'login.html';
        return;
    }

    listarJogos();
}

async function editarJogo(id, nomeAtual) {
    const novoNome = prompt('Editar nome do jogo:', nomeAtual);

    if (!novoNome || novoNome === nomeAtual) return;

    const res = await fetch(API + 'games/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
        body: JSON.stringify({ name: novoNome })
    });

    if (res.status === 401) {
        localStorage.removeItem('token');
        location.href = 'login.html';
        return;
    }

    listarJogos();
}
