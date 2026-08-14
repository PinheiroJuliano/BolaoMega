const token = localStorage.getItem('token');

if (!token) {
    window.location.href = 'login.html';
    throw new Error('Usuário não autenticado');
}

function logout() {
    localStorage.removeItem('token');
    location.href = 'login.html';
}

let jogosGerados = [];

function formatNumber(value) {
    return `<span class="number-badge">${String(value).padStart(2, '0')}</span>`;
}

function renderJogosGerados() {
    const result = document.getElementById('result');
    if (!result) return;

    result.innerHTML = '';

    if (!jogosGerados.length) {
        result.innerHTML = '<div class="empty-state">Nenhum jogo gerado ainda. Ajuste a quantidade e clique em “Gerar números”.</div>';
        return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'generated-games';

    jogosGerados.forEach((jogo, index) => {
        const card = document.createElement('div');
        card.className = 'generated-game-card';

        card.innerHTML = `
            <div class="game-header">
                <span>Jogo ${index + 1}</span>
            </div>
            <div class="lottery-numbers">
                ${jogo.map(formatNumber).join('')}
            </div>
        `;

        wrapper.appendChild(card);
    });

    const actions = document.createElement('div');
    actions.className = 'generated-actions';

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn-primary';
    saveBtn.textContent = 'Salvar jogos';
    saveBtn.onclick = () => {
        const nome = prompt('Dê um nome para esse conjunto de jogos:');
        if (nome) salvarJogos(nome, jogosGerados);
    };

    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'btn-ghost';
    clearBtn.textContent = 'Limpar';
    clearBtn.onclick = () => {
        jogosGerados = [];
        renderJogosGerados();
    };

    actions.appendChild(saveBtn);
    actions.appendChild(clearBtn);
    result.appendChild(wrapper);
    result.appendChild(actions);

    const statusTarget = document.getElementById('statusStat');
    if (statusTarget) statusTarget.textContent = `${jogosGerados.length} jogo(s)`;

    const lastGenerated = document.getElementById('lastGeneratedStat');
    if (lastGenerated) lastGenerated.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function gerarJogos() {
    const qtd = Math.max(1, Number(document.getElementById('numJogos').value) || 1);
    const safeQuantidade = Math.min(qtd, 20);
    jogosGerados = [];

    for (let i = 0; i < safeQuantidade; i++) {
        jogosGerados.push(gerarJogo());
    }

    renderJogosGerados();
}

function gerarJogo() {
    const set = new Set();
    while (set.size < 6) {
        set.add(Math.floor(Math.random() * 60) + 1);
    }
    return [...set].sort((a, b) => a - b);
}

const numJogosInput = document.getElementById('numJogos');
if (numJogosInput) {
    numJogosInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            gerarJogos();
        }
    });
}

if (typeof listarJogos === 'function') {
    listarJogos();
}
