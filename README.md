# Web AI Assistant

Aplicação web simples para fazer perguntas e receber respostas usando a API do **Google Gemini**.  
Permite inserir e validar a chave da API, escolher o modelo, escrever a pergunta, exibir a resposta e realizar ações como copiar ou limpar.

---

## Funcionalidades

- Inserir **API Key** do Google Gemini
- Validação básica da chave (simulada no código)
- Seleção de modelo da IA
- Envio de pergunta via botão ou atalho **Ctrl+Enter**
- Exibição da pergunta e resposta da IA
- Indicador de **loading** enquanto processa
- Mensagens de erro e sucesso
- Botão para **copiar** a resposta
- Botão para **limpar** e fazer nova pergunta
- Contador de caracteres
- **LocalStorage** para salvar a API Key

---

## Estrutura do Projeto

projeto-ia/
├── index.html # Estrutura da página
├── style.css # Estilos da interface
└── script.js # Lógica e integração com a API


---

## 🛠 Tecnologias

- **HTML5** → Estrutura semântica
- **CSS3** → Layout responsivo e estilização
- **JavaScript (ES6+)** → Lógica e integração com API
- **Google Gemini API** → Processamento de linguagem natural

---

## 📋 Pré-requisitos

- Navegador moderno (Chrome, Firefox, Edge, etc.)
- **API Key do Google Gemini**
    1. Acesse [Google AI Studio](https://aistudio.google.com/apikey)
    2. Faça login com sua conta Google
    3. Clique em **"Get API Key"**
    4. Copie e guarde a chave

---

## ▶ Como Usar

1. **Baixe ou clone** este repositório
    ```bash
    git clone https://github.com/seu-usuario/projeto-ia.git
    ```
2. Abra o arquivo `index.html` no navegador
3. Cole sua **API Key** no campo indicado
4. Clique no ícone 🔍 para validar
5. Escolha o modelo da IA
6. Digite sua pergunta e clique em **Perguntar** (ou pressione Ctrl+Enter)
7. Veja a resposta e use os botões de copiar ou limpar

---

##  Observações

- A validação da API Key no código atual é **simulada** (apenas verifica tamanho da chave).  
  Para validar de verdade, é necessário fazer uma chamada de teste para a API.
- Não compartilhe sua API Key publicamente.
- Este projeto foi desenvolvido para fins educacionais e pode ser adaptado para outras APIs.

---

##  Licença

Este projeto está sob a licença MIT.  
Sinta-se livre para usar, modificar e compartilhar.
