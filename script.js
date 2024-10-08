// Função para limpar os jogos exibidos
function limparJogos() {
    let resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Limpa o conteúdo da div de resultados
}

// Adiciona um event listener ao botão de limpar
document.getElementById('cleanButton').addEventListener('click', limparJogos);

// Função para gerar um número aleatório entre min (inclusive) e max (inclusive)
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Função para gerar um único jogo de números únicos
function gerarJogo(min, max, rangeJogo) {
    let numerosJogo = new Set();
    while (numerosJogo.size < rangeJogo) {
        let randomNumberInRange = getRandomNumber(min, max);
        numerosJogo.add(randomNumberInRange);
    }
    return Array.from(numerosJogo).sort((a, b) => a - b);
}

// Função para gerar e exibir os jogos de números
function gerarEExibirJogos() {
    let numJogos = parseInt(document.getElementById('numJogos').value, 10);
    let min = 1;
    let max = 60;
    let rangeJogo = 6;
    let resultDiv = document.getElementById('result');

    // Limpa os resultados anteriores
    resultDiv.innerHTML = '';

    // Gera os jogos solicitados
    for (let i = 0; i < numJogos; i++) {
        let jogo = gerarJogo(min, max, rangeJogo);
        let jogoDiv = document.createElement('div');
        jogoDiv.innerHTML = `Jogo ${i + 1}: <span>${jogo.join(', ')}</span>`;
        resultDiv.appendChild(jogoDiv);
    }
}

// Adiciona um event listener ao botão para gerar números quando clicado
document.getElementById('generateButton').addEventListener('click', gerarEExibirJogos);

// Adiciona um event listener ao campo de entrada para gerar números quando a tecla Enter é pressionada
document.getElementById('numJogos').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        gerarEExibirJogos();
        event.preventDefault(); // Evita o comportamento padrão, se necessário
    }
});
