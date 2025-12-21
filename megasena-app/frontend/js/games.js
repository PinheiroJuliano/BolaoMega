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
        <strong>${game.name}</strong> (${game.date})<br>
        ${game.numbers
            .map(j => j.join(', '))
            .join('<br>')}
        <br>
        <button onclick="editarJogo(${game.id}, '${game.name.replace(/'/g, "\\'")}')">
            Editar
        </button>
        <button onclick="excluirJogo(${game.id})">
            Excluir
        </button>
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
