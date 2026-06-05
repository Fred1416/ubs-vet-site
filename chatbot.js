/**
 * ====================================================================
 * ASSISTENTE VIRTUAL JULIANA (CHATBOT LOCAL) - UBS VET POPULAR
 * ====================================================================
 * 
 * Fala, Fred! Professor Rodolfo Mori aqui na área! 🚀
 * Este arquivo JavaScript controla toda a lógica da nossa assistente virtual.
 * 
 * Aqui nós estamos usando:
 * - Variáveis e Objetos para guardar os dados da triagem.
 * - Manipulação da DOM (Document Object Model) para ler inputs e criar mensagens na tela.
 * - Uma Máquina de Estados simples (usando a variável `chatState`) para saber qual pergunta fazer.
 * - Estruturas condicionais (switch/case e if/else) para dar conselhos de acordo com os sintomas.
 * - Template Strings para formatar a mensagem do WhatsApp dinamicamente.
 */

// ====================================================================
// 1. CONFIGURAÇÕES E ESTADO DO CHAT
// ====================================================================

// Número do WhatsApp da UBS VET (para onde a triagem será enviada)
const CHATBOT_WHATSAPP_NUMBER = '5531971364558'; 

// Estado atual da conversa (controle de fluxo de perguntas)
// 0 = Aguardando Nome do Tutor
// 1 = Aguardando Nome do Pet
// 2 = Aguardando Raça do Pet
// 3 = Aguardando Idade do Pet
// 4 = Aguardando Sintomas
// 5 = Triagem Concluída
let chatState = 0;

// Objeto para armazenar as informações coletadas durante a triagem
const triageData = {
    tutorName: '',
    petName: '',
    petBreed: '',
    petAge: '',
    petSymptoms: ''
};

// ====================================================================
// 2. REFERÊNCIAS DOS ELEMENTOS HTML (DOM)
// ====================================================================
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('chatbot-toggle');
    const closeBtn = document.getElementById('chatbot-close');
    const chatWindow = document.getElementById('chatbot-window');
    const chatMessages = document.getElementById('chatbot-messages');
    const chatInput = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send');
    const badge = toggleBtn.querySelector('.chatbot-toggle-badge');

    // Variável de controle para enviar a mensagem inicial apenas uma vez
    let firstOpen = true;

    // ====================================================================
    // 3. EVENTOS (LISTENERS) DE ABRIR/FECHAR E ENVIAR
    // ====================================================================

    // Abrir/Fechar a janela de chat ao clicar no botão flutuante
    toggleBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        
        // Remove a notificação vermelha (badge) ao abrir o chat
        if (badge) {
            badge.style.display = 'none';
        }

        // Se for a primeira vez abrindo o chat, envia a mensagem de boas-vindas
        if (firstOpen) {
            sendBotMessage("Olá! Sou a **Juliana**, assistente virtual da **UBS VET Popular**. 🐾\n\nEstou aqui para ajudar no atendimento básico de saúde do seu pet e agilizar a sua consulta.\n\nPara começarmos, por favor, me diga **o seu nome (nome do tutor)**:");
            firstOpen = false;
        }

        // Foca automaticamente no campo de texto para o usuário digitar
        setTimeout(() => chatInput.focus(), 300);
    });

    // Fechar a janela ao clicar no botão fechar "X"
    closeBtn.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    // Enviar mensagem ao clicar no botão de enviar
    sendBtn.addEventListener('click', handleUserSend);

    // Enviar mensagem ao pressionar a tecla "Enter" no teclado
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleUserSend();
        }
    });

    // Vincular botões da página que possuem a classe para abrir o chat diretamente
    const chatTriggers = document.querySelectorAll('.btn-chatbot-trigger');
    chatTriggers.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Impede o pulo para a seção #contato
            
            // Abre o chat adicionando a classe 'active'
            chatWindow.classList.add('active');
            
            // Remove a notificação da badge vermelha
            if (badge) {
                badge.style.display = 'none';
            }

            // Inicia o atendimento da Juliana se for a primeira abertura
            if (firstOpen) {
                sendBotMessage("Olá! Sou a **Juliana**, assistente virtual da **UBS VET Popular**. 🐾\n\nEstou aqui para ajudar no atendimento básico de saúde do seu pet e agilizar a sua consulta.\n\nPara começarmos, por favor, me diga **o seu nome (nome do tutor)**:");
                firstOpen = false;
            }

            // Rola as mensagens e foca no input para digitação
            setTimeout(() => {
                chatInput.focus();
                chatMessages.scrollTo({
                    top: chatMessages.scrollHeight,
                    behavior: 'smooth'
                });
            }, 300);
        });
    });

    // ====================================================================
    // 4. FUNÇÕES DE FLUXO E LÓGICA DO CHAT
    // ====================================================================

    // Função que lê a mensagem digitada pelo usuário e a exibe na tela
    function handleUserSend() {
        const text = chatInput.value.trim();
        if (text === '') return; // Se estiver vazio, não faz nada

        // 1. Exibe a mensagem do usuário na tela
        sendUserMessage(text);
        
        // 2. Limpa o campo de texto
        chatInput.value = '';

        // 3. Processa a resposta baseada no estado atual
        setTimeout(() => {
            processTriageFlow(text);
        }, 800); // Adiciona um pequeno atraso para simular o tempo de resposta
    }

    // Função principal que decide qual pergunta fazer ou o que salvar
    function processTriageFlow(userInput) {
        switch (chatState) {
            case 0:
                // Salvou o Nome do Tutor
                triageData.tutorName = userInput;
                chatState = 1;
                sendBotMessage(`Muito prazer, **${triageData.tutorName}**! E qual é o **nome** do seu pet? 🐶🐱 (por exemplo: Mel, Thor...)`);
                break;

            case 1:
                // Salvou o Nome do Pet
                triageData.petName = userInput;
                chatState = 2;
                sendBotMessage(`Que nome lindo! Qual é a **raça** dele(a)? 🧬 (Se for vira-lata, pode escrever SRD)`);
                break;

            case 2:
                // Salvou a Raça
                triageData.petBreed = userInput;
                chatState = 3;
                sendBotMessage(`Certo! E quantos **anos** de idade ele(a) tem? 🎂`);
                break;

            case 3:
                // Salvou a Idade
                triageData.petAge = userInput;
                chatState = 4;
                sendBotMessage(`Perfeito. Agora, me diga de forma resumida: **quais são os sintomas** ou o motivo da consulta dele(a)? 🌡️`);
                break;

            case 4:
                // Salvou os Sintomas e processa o encerramento com conselho
                triageData.petSymptoms = userInput;
                chatState = 5;

                // Envia conselho básico de saúde antes de finalizar
                const healthAdvice = getBasicHealthAdvice(userInput);
                sendBotMessage(healthAdvice);

                // Mostra o resumo da triagem e o botão do WhatsApp
                setTimeout(() => {
                    finishTriageAndShowWhatsAppButton();
                }, 1500);
                break;

            default:
                // Se a triagem já terminou, a Juliana responde de forma genérica
                sendBotMessage("Sua triagem já foi concluída! Por favor, clique no botão acima para enviar os dados para o especialista via WhatsApp, ou feche o chat.");
                break;
        }
    }

    // ====================================================================
    // 5. INTELIGÊNCIA ARTIFICIAL SIMPLIFICADA (ANÁLISE DE PALAVRAS-CHAVE)
    // ====================================================================
    
    // Função que analisa o texto de sintomas em busca de palavras-chave para dar dicas úteis
    function getBasicHealthAdvice(symptoms) {
        const text = symptoms.toLowerCase();
        
        let advice = "🦴 **Orientação Básica da Juliana:** ";

        if (text.includes('vomito') || text.includes('vomitar') || text.includes('vomitando')) {
            advice += "Se seu pet está vomitando, evite oferecer água ou ração nas próximas 2 horas para deixar o estômago descansar. Se o vômito persistir ou tiver sangue, traga-o urgente à clínica 24H.";
        } else if (text.includes('diarreia') || text.includes('fezes mole') || text.includes('cagando')) {
            advice += "Se o pet está com diarreia, mantenha-o bem hidratado. Você pode oferecer soro caseiro ou água de coco em pequenas doses. Evite trocar a ração repentinamente.";
        } else if (text.includes('coceira') || text.includes('coçando') || text.includes('pele') || text.includes('pelo')) {
            advice += "Para coceiras ou alergias de pele, evite dar banho quente e não aplique produtos caseiros sem indicação (vinagre, pomadas humanas, etc.), pois podem agravar a dermatite.";
        } else if (text.includes('sangue') || text.includes('sangrando') || text.includes('machucado')) {
            advice += "🚨 **Atenção:** Presença de sangue ou machucados abertos requer atendimento veterinário presencial imediato. Mantenha o local limpo com soro fisiológico e traga-o à nossa emergência.";
        } else if (text.includes('desanimado') || text.includes('triste') || text.includes('quieto') || text.includes('fraqueza')) {
            advice += "A letargia (desânimo) pode indicar febre ou dor. Monitore a temperatura e se o pet está comendo. Se ele recusar comida por mais de 24 horas, marque uma consulta.";
        } else if (text.includes('vacina') || text.includes('vacinar') || text.includes('vacinacao')) {
            advice += "Lembrete: Mantenha a carteira de vacinas atualizada para proteger seu pet contra viroses graves (como Parvovirose e Cinomose). Filhotes não devem passear na rua até o fim das vacinas.";
        } else {
            advice += "Entendi os sintomas. Para segurança do seu pet, o ideal é nunca medicá-lo em casa sem receita. Registrei tudo aqui para o veterinário de plantão.";
        }

        return advice;
    }

    // ====================================================================
    // 6. FORMATAÇÃO DA TRIAGEM E REDIRECIONAMENTO WHATSAPP
    // ====================================================================

    // Função que exibe a mensagem de resumo e insere o botão do WhatsApp
    function finishTriageAndShowWhatsAppButton() {
        // Formata a mensagem com as quebras de linha e emojis corretos para o WhatsApp
        const whatsappText = `Olá, gostaria de agendar uma consulta. Realizei a triagem prévia com a Juliana:

👤 *Tutor:* ${triageData.tutorName}
🐾 *Pet:* ${triageData.petName}
🧬 *Raça:* ${triageData.petBreed}
🎂 *Idade:* ${triageData.petAge}
🌡️ *Sintomas:* ${triageData.petSymptoms}`;

        // Codifica a mensagem para formato URL (substitui espaços, acentos, etc.)
        const encodedText = encodeURIComponent(whatsappText);
        
        // Link dinâmico do WhatsApp da UBS VET Popular
        const whatsappLink = `https://wa.me/${CHATBOT_WHATSAPP_NUMBER}?text=${encodedText}`;

        // Mensagem final na janela do chat
        sendBotMessage(`Tudo pronto, **${triageData.tutorName}**! Triagem finalizada. Aqui está o resumo:\n\n* **Tutor:** ${triageData.tutorName}\n* **Pet:** ${triageData.petName} (${triageData.petBreed}, ${triageData.petAge})\n* **Sintomas:** ${triageData.petSymptoms}`);

        // Cria e adiciona o botão verde do WhatsApp dinamicamente dentro da caixa de chat
        const buttonHTML = `
            <div class="chat-message bot">
                Excelente! Agora clique no botão abaixo para nos enviar esta triagem no WhatsApp. Nosso especialista de plantão já estará te aguardando para prosseguir com o agendamento!
                <a href="${whatsappLink}" target="_blank" class="chatbot-btn-whatsapp">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.907h.003c4.37 0 7.926-3.56 7.93-7.934A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.69-4.98c-.202-.1-.195-.177-.59-.64-.395-.463-.807-.895-1.01-1.1-.202-.206-.334-.268-.468-.068-.135.2-.522.64-.64.776-.118.135-.237.15-.44.05-.204-.1-1.61-.593-2.502-1.387-.693-.613-1.161-1.372-1.297-1.612-.136-.24-.015-.37.106-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.4-.06-.1-.522-1.25-.716-1.72-.188-.457-.378-.396-.518-.403-.135-.007-.29-.007-.446-.007a.895.895 0 0 0-.646.3c-.22.24-.84.82-.84 2.008 0 1.187.864 2.33 1.057 2.585.195.258 1.7 2.597 4.12 3.64.577.248 1.028.396 1.378.508.58.185 1.108.16 1.526.098.465-.069 1.428-.583 1.63-1.147.201-.564.201-1.05.14-1.147-.061-.097-.223-.156-.426-.256z"/>
                    </svg>
                    Enviar Triagem no WhatsApp
                </a>
            </div>
        `;
        appendMessageContainer(buttonHTML);
    }

    // ====================================================================
    // 7. AUXILIARES DE RENDERIZAÇÃO NA TELA
    // ====================================================================

    // Adiciona uma mensagem escrita pela Juliana (bot) na tela
    function sendBotMessage(text) {
        // Converte marcações simples de **negrito** e \n para tags HTML corretas
        const formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');

        const msgHTML = `<div class="chat-message bot">${formattedText}</div>`;
        appendMessageContainer(msgHTML);
    }

    // Adiciona uma mensagem escrita pelo tutor (usuário) na tela
    function sendUserMessage(text) {
        const msgHTML = `<div class="chat-message user">${text}</div>`;
        appendMessageContainer(msgHTML);
    }

    // Adiciona o HTML de mensagem na caixa de chat e faz o scroll ir para o final
    function appendMessageContainer(html) {
        chatMessages.insertAdjacentHTML('beforeend', html);
        
        // Rolagem suave até a última mensagem
        chatMessages.scrollTo({
            top: chatMessages.scrollHeight,
            behavior: 'smooth'
        });
    }
});
