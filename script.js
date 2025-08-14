document.addEventListener('DOMContentLoaded', () => {
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
    const displayedQuestion = document.getElementById('displayedQuestion');
    const responseContent = document.getElementById('responseContent');
    const copyButton = document.getElementById('copyButton');
    const clearButton = document.getElementById('clearButton');

    let validatedApiKey = localStorage.getItem('apiKey');

    const showToast = (element, message, duration = 3000) => {
        element.textContent = message;
        element.classList.add('show');
        setTimeout(() => {
            element.classList.remove('show');
        }, duration);
    };

    const updateApiStatus = (status, text) => {
        apiStatus.className = `api-status ${status}`;
        apiStatusIcon.textContent = status === 'valid' ? '✅' : status === 'invalid' ? '❌' : '⏳';
        apiStatusText.textContent = text;
        apiStatus.style.display = 'flex';
    };

    const validateApiKey = () => {
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            updateApiStatus('invalid', 'A chave da API não pode estar vazia.');
            return;
        }
        updateApiStatus('pending', 'Validando chave...');
        setTimeout(() => {
            if (apiKey.length > 20) {
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

    const handleAskQuestion = async () => {
        const question = questionInput.value.trim();
        const model = modelSelect.value;

        if (!validatedApiKey) {
            showToast(errorMessage, 'Por favor, valide sua chave da API primeiro.');
            return;
        }
        if (!question) {
            showToast(errorMessage, 'Por favor, digite sua pergunta.');
            return;
        }

        loadingDiv.style.display = 'flex';
        responseSection.style.display = 'none';
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
        askButton.disabled = true;

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${validatedApiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: question }] }] }),
                }
            );

            const data = await response.json();

            // Bloqueio de limite diário
            if (response.status === 429 || data?.error?.status === "RESOURCE_EXHAUSTED") {
                throw new Error("⚠️ Limite diário atingido. Tente novamente amanhã ou troque sua API Key.");
            }

            if (!response.ok) {
                throw new Error(data?.error?.message || 'Erro na comunicação com a API.');
            }

            displayedQuestion.textContent = question;
            responseContent.textContent = 
                data.candidates?.[0]?.content?.parts?.[0]?.text || 
                data.candidates?.[0]?.output_text || 
                "Não foi possível obter uma resposta.";

            responseSection.style.display = 'block';
            responseSection.classList.add('show');

        } catch (error) {
            showToast(errorMessage, error.message);
        } finally {
            loadingDiv.style.display = 'none';
            askButton.disabled = false;
        }
    };

    if (validatedApiKey) {
        apiKeyInput.value = validatedApiKey;
        updateApiStatus('valid', 'Chave da API carregada.');
    }

    validateIcon.addEventListener('click', validateApiKey);

    questionInput.addEventListener('input', () => {
        characterCount.textContent = questionInput.value.length;
        askButton.disabled = questionInput.value.length === 0;
    });

    askButton.addEventListener('click', handleAskQuestion);

    questionInput.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            handleAskQuestion();
        }
    });

    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(responseContent.textContent)
            .then(() => showToast(successMessage, 'Resposta copiada para a área de transferência!'))
            .catch(() => showToast(errorMessage, 'Falha ao copiar a resposta.'));
    });

    clearButton.addEventListener('click', () => {
        questionInput.value = '';
        responseSection.style.display = 'none';
        responseSection.classList.remove('show');
        characterCount.textContent = '0';
        askButton.disabled = true;
    });

    askButton.disabled = true;
    responseSection.style.display = 'none';
    loadingDiv.style.display = 'none';
});
