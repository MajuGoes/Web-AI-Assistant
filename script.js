document.addEventListener('DOMContentLoaded', () => {

   

    // Pega todos os elementos que vamos usar
    const apiKeyInput = document.getElementById('apiKey');
    const validateIcon = document.getElementById('validateIcon');
    const apiStatus = document.getElementById('apiStatus');
    const apiStatusIcon = document.getElementById('apiStatusIcon');
    const apiStatusText = document.getElementById('apiStatusText');
    const modelSelect = document.getElementById('modelSelect');
    const questionInput = document.getElementById('questionInput');
    const askButton = document.getElementById('askButton');
    const characterCount = document.getElementById('characterCount');
    const loadingDiv = document.getElementById('loadingDiv');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const responseSection = document.getElementById('responseSection');
    const questionDisplay = document.getElementById('questionDisplay');
    const displayedQuestion = document.getElementById('displayedQuestion');
    const responseContent = document.getElementById('responseContent');
    const copyButton = document.getElementById('copyButton');
    const clearButton = document.getElementById('clearButton');

  

    // Guarda a API Key se já tiver salva no navegador
    let validatedApiKey = localStorage.getItem('apiKey');

    // Função pra mostrar uma mensagenzinha por alguns segundos
    const showToast = (element, message, duration = 3000) => {
        element.textContent = message;
        element.classList.add('show');
        setTimeout(() => {
            element.classList.remove('show');
        }, duration);
    };

    // Atualiza o status da API Key (valida, inválida, carregando)
    const updateApiStatus = (status, text) => {
        apiStatus.className = `api-status ${status}`;
        apiStatusIcon.textContent = status === 'valid' ? '✅' : status === 'invalid' ? '❌' : '⏳';
        apiStatusText.textContent = text;
        apiStatus.style.display = 'flex';
    };

    // Testa se a API Key é boa (aqui é só simulação)
    const validateApiKey = async () => {
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            updateApiStatus('invalid', 'A chave da API não pode estar vazia.');
            return;
        }

        updateApiStatus('pending', 'Validando chave...');
        
        // Só simula a validação (não bate na API de verdade)
        setTimeout(() => {
            if (apiKey.length > 20) { // se for grandinha, vamos dizer que é válida
                validatedApiKey = apiKey;
                localStorage.setItem('apiKey', apiKey);
                updateApiStatus('valid', 'Chave da API validada com sucesso!');
                showToast(successMessage, 'Chave da API salva!', 2000);
            } else {
                validatedApiKey = null;
                localStorage.removeItem('apiKey');
                updateApiStatus('invalid', 'Chave da API inválida.');
            }
        }, 1000);
    };

    // Envia a pergunta pra API e mostra a resposta
    const handleAskQuestion = async () => {
        const question = questionInput.value.trim();
        const model = modelSelect.value;

        // Confere se tá tudo certo antes de mandar
        if (!validatedApiKey) {
            showToast(errorMessage, 'Por favor, valide sua chave da API primeiro.');
            return;
        }
        if (!question) {
            showToast(errorMessage, 'Por favor, digite sua pergunta.');
            return;
        }

        // Mostra loading e esconde outras coisas
        loadingDiv.style.display = 'flex';
        responseSection.style.display = 'none';
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
        askButton.disabled = true;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${validatedApiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: question
                        }]
                    }]
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message || 'Erro na comunicação com a API.');
            }

            const data = await response.json();

            // Coloca a pergunta e a resposta na tela
            displayedQuestion.textContent = question;
            if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts[0]) {
                responseContent.textContent = data.candidates[0].content.parts[0].text;
            } else {
                responseContent.textContent = "Não foi possível obter uma resposta.";
            }
            responseSection.style.display = 'block';
            responseSection.classList.add('show');

        } catch (error) {
            showToast(errorMessage, `Erro: ${error.message}`);
        } finally {
            // Some com o loading e libera o botão
            loadingDiv.style.display = 'none';
            askButton.disabled = false;
        }
    };

    // Se já tiver API Key salva, já mostra como válida
    if (validatedApiKey) {
        apiKeyInput.value = validatedApiKey;
        updateApiStatus('valid', 'Chave da API carregada.');
    }

    // Clique no ícone pra validar API Key
    validateIcon.addEventListener('click', validateApiKey);

    // Contador de caracteres da pergunta
    questionInput.addEventListener('input', () => {
        const count = questionInput.value.length;
        characterCount.textContent = count;
        askButton.disabled = count === 0;
    });

    // Botão de perguntar
    askButton.addEventListener('click', handleAskQuestion);
    
    // Atalho Ctrl+Enter pra mandar a pergunta
    questionInput.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            handleAskQuestion();
        }
    });

    // Botão de copiar resposta
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(responseContent.textContent).then(() => {
            showToast(successMessage, 'Resposta copiada para a área de transferência!');
        }).catch(err => {
            showToast(errorMessage, 'Falha ao copiar a resposta.');
        });
    });

    // Botão pra limpar e fazer nova pergunta
    clearButton.addEventListener('click', () => {
        questionInput.value = '';
        responseSection.style.display = 'none';
        responseSection.classList.remove('show');
        characterCount.textContent = '0';
        askButton.disabled = true;
    });

    // Deixa o botão de perguntar desativado no começo
    askButton.disabled = true;
    responseSection.style.display = 'none';
    loadingDiv.style.display = 'none';
});
