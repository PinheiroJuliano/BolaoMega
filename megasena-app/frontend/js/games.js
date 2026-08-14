if (!localStorage.getItem('token')) {
    location.href = 'login.html';
}

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

    const statusTarget = document.getElementById('statusStat');
    if (statusTarget) statusTarget.textContent = 'Salvo';

    listarJogos();
}

async function listarJogos() {
    const container = document.getElementById('savedGames');
    const totalGamesStat = document.getElementById('totalGamesStat');

    if (!container) return;

    const res = await fetch(API + 'games', {
        headers: authHeader()
    });

    if (res.status === 401) {
        localStorage.removeItem('token');
        location.href = 'login.html';
        return;
    }

    const games = await res.json();

    if (totalGamesStat) {
        totalGamesStat.textContent = String(games.length || 0);
    }

    container.innerHTML = '';

    if (!games.length) {
        container.innerHTML = '<div class="empty-state">Você ainda não salvou nenhum jogo. Gere alguns e salve o seu próximo palpite.</div>';
        return;
    }

    games.forEach(game => {
        const card = document.createElement('article');
        card.className = 'game-card';

        const info = document.createElement('div');
        info.className = 'game-info';

        const titleRow = document.createElement('div');
        titleRow.className = 'game-name-row';

        const title = document.createElement('strong');
        title.textContent = game.name;

        const date = document.createElement('span');
        date.className = 'game-date';
        date.textContent = game.date || 'Hoje';

        titleRow.appendChild(title);
        titleRow.appendChild(date);

        const numberGroups = document.createElement('div');
        numberGroups.className = 'lottery-numbers';

        (game.numbers || []).forEach(group => {
            const groupWrap = document.createElement('div');
            groupWrap.className = 'game-number-group';

            group.forEach(number => {
                const badge = document.createElement('span');
                badge.className = 'number-badge small';
                badge.textContent = String(number).padStart(2, '0');
                groupWrap.appendChild(badge);
            });

            numberGroups.appendChild(groupWrap);
        });

        info.appendChild(titleRow);
        info.appendChild(numberGroups);

        const actions = document.createElement('div');
        actions.className = 'game-actions';

        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'btn-icon';
        editBtn.title = 'Editar jogo';
        editBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor"/>
                <path d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42L18.37 3.29a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.83z" fill="currentColor"/>
            </svg>
        `;
        editBtn.addEventListener('click', () => editarJogo(game.id, game.name));

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'btn-icon';
        deleteBtn.title = 'Excluir jogo';
        deleteBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M6 7h12M9 7v10m6-10v10M4 7h16l-1 14H5L4 7zM9 4h6l1 3H8l1-3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        deleteBtn.addEventListener('click', () => excluirJogo(game.id));

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        card.appendChild(info);
        card.appendChild(actions);
        container.appendChild(card);
    });
}

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
