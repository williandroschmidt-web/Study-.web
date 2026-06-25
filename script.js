const chatArea = document.getElementById("chatArea");
const perguntaInput = document.getElementById("pergunta");
const materiaSelect = document.getElementById("materia");
const modoSelect = document.getElementById("modo");
const enviarBtn = document.getElementById("enviarBtn");
const limparBtn = document.getElementById("limparBtn");

function formatTextToHtml(text) {
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  html = html.replace(/^## (.*)$/gm, "<h3>$1</h3>");
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\n/g, "<br>");

  return html;
}

function createMessageElement(type, title, content) {
  const wrapper = document.createElement("div");
  wrapper.className = `message ${type}`;

  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = type === "ai" ? "S+" : "Você";

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";

  const finalTitle = title ? `<h3>${title}</h3>` : "";
  bubble.innerHTML = `${finalTitle}<p>${formatTextToHtml(content)}</p>`;

  wrapper.appendChild(avatar);
  wrapper.appendChild(bubble);

  return wrapper;
}

function addUserMessage(text) {
  const message = createMessageElement("user", "Sua pergunta", text);
  chatArea.appendChild(message);
  scrollToBottom();
}

function addAiMessage(title, content) {
  const message = createMessageElement("ai", title, content);
  chatArea.appendChild(message);
  scrollToBottom();
}

function addTemporaryAiMessage() {
  const wrapper = document.createElement("div");
  wrapper.className = "message ai";
  wrapper.id = "typing-message";

  wrapper.innerHTML = `
    <div class="message-avatar">S+</div>
    <div class="message-bubble">
      <h3>Study+ está pensando...</h3>
      <p>Preparando sua resposta de estudos.</p>
    </div>
  `;

  chatArea.appendChild(wrapper);
  scrollToBottom();
}

function removeTemporaryAiMessage() {
  const temp = document.getElementById("typing-message");
  if (temp) temp.remove();
}

function scrollToBottom() {
  chatArea.scrollTop = chatArea.scrollHeight;
}

function formatarTopicos(lista) {
  return lista.map(item => `- ${item}`).join("\n");
}

function gerarResposta(materia, modo, pergunta) {
  const perguntaLimpa = pergunta.trim();

  if (!perguntaLimpa) {
    return {
      titulo: "Pergunta vazia",
      conteudo: "Digite uma pergunta ou tema para o Study+ te ajudar."
    };
  }

  if (modo === "explicar") {
    return respostaExplicar(materia, perguntaLimpa);
  }

  if (modo === "explicar_resposta") {
    return respostaExplicarResposta(materia, perguntaLimpa);
  }

  if (modo === "revisao") {
    return respostaRevisao(materia, perguntaLimpa);
  }

  if (modo === "quiz") {
    return respostaQuiz(materia, perguntaLimpa);
  }

  if (modo === "resumo") {
    return respostaResumo(materia, perguntaLimpa);
  }

  return {
    titulo: "Modo não reconhecido",
    conteudo: "O modo selecionado não foi encontrado."
  };
}

function respostaExplicar(materia, pergunta) {
  return {
    titulo: `Explicação • ${materia}`,
    conteudo:
`Você pediu uma explicação sobre **${pergunta}** na matéria **${materia}**.

## Explicação
O ideal é entender primeiro o conceito principal desse tema, depois observar exemplos, aplicações e palavras-chave importantes. No Study+, esse modo serve para te ajudar a compreender o conteúdo de forma mais clara, como se fosse uma revisão guiada.

## Como estudar esse tema
- Identifique o assunto principal da pergunta
- Procure os conceitos mais importantes
- Relacione com exemplos
- Faça um resumo com suas próprias palavras

## Dica do Study+
Depois de entender a explicação, use o modo **Explicar + Resposta** ou **Quiz** para treinar.`
  };
}

function respostaExplicarResposta(materia, pergunta) {
  return {
    titulo: `Explicar + Resposta • ${materia}`,
    conteudo:
`Você pediu o modo **Explicar + Resposta** para **${pergunta}** em **${materia}**.

## 1. Explicação
Nesse modo, a ideia é primeiro entender o raciocínio do conteúdo e só depois chegar na resposta final. Isso ajuda a estudar de verdade, em vez de apenas copiar a resposta.

## 2. Como pensar nesse tipo de questão
- Leia com atenção o que está sendo pedido
- Separe palavras-chave da pergunta
- Relacione com a matéria escolhida
- Organize a resposta por etapas

## 3. Resposta final
**Resposta resumida sobre “${pergunta}”**: o tema deve ser respondido usando os conceitos centrais da matéria **${materia}**, com linguagem clara, organizada e objetiva.

## 4. Dica de prova
Se for uma questão discursiva, comece definindo o assunto, depois explique a ideia principal e finalize com uma conclusão curta.`
  };
}

function respostaRevisao(materia, pergunta) {
  const topicos = [
    `Definição de ${pergunta}`,
    `Características principais de ${pergunta}`,
    `Exemplos importantes sobre ${pergunta}`,
    `Possíveis relações de ${pergunta} com outros conteúdos`,
    `Questões que podem cair na prova sobre ${pergunta}`
  ];

  return {
    titulo: `Revisão para Prova • ${materia}`,
    conteudo:
`Modo **Revisão para Prova** ativado para o tema **${pergunta}** em **${materia}**.

## Roteiro de revisão
${formatarTopicos(topicos)}

## Como revisar bem
1. Leia um resumo do tema
2. Destaque palavras-chave
3. Faça 3 perguntas sobre o conteúdo
4. Tente responder sem olhar
5. Corrija o que errou

## Mini revisão pronta
Para revisar **${pergunta}**, foque no conceito principal, nos exemplos, nas aplicações e nos pontos que diferenciam esse conteúdo de outros da matéria **${materia}**.

## Dica do Study+
Depois da revisão, use o modo **Quiz** para testar se você realmente aprendeu.`
  };
}

function embaralharArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function respostaQuiz(materia, pergunta) {
  const perguntas = embaralharArray([
    `O que é ${pergunta}?`,
    `Quais são as principais características de ${pergunta}?`,
    `Como ${pergunta} pode aparecer em uma prova de ${materia}?`,
    `Qual é a importância de ${pergunta} dentro de ${materia}?`,
    `Cite um exemplo relacionado a ${pergunta}.`
  ]);

  return {
    titulo: `Quiz • ${materia}`,
    conteudo:
`Modo **Quiz** ativado para **${pergunta}** em **${materia}**.

## Perguntas para treinar
1. ${perguntas[0]}
2. ${perguntas[1]}
3. ${perguntas[2]}

## Como usar o quiz
- Tente responder sozinho primeiro
- Depois confira no seu material
- Marque o que você não souber
- Volte ao modo **Explicar** ou **Resumo** para revisar

## Dica do Study+
Se quiser um treino mais forte, responda no caderno sem consultar nada por 5 minutos.`
  };
}

function respostaResumo(materia, pergunta) {
  return {
    titulo: `Resumo • ${materia}`,
    conteudo:
`Modo **Resumo** ativado para **${pergunta}** em **${materia}**.

## Resumo rápido
O tema **${pergunta}** deve ser entendido a partir do seu conceito central, dos seus exemplos mais importantes e da forma como ele aparece dentro da matéria **${materia}**.

## Resumo em tópicos
- Conceito principal do tema
- Palavras-chave importantes
- Exemplo ou aplicação
- O que mais pode cair na prova

## Como transformar isso em estudo de verdade
1. Leia o resumo
2. Reescreva com suas palavras
3. Faça 2 perguntas sobre o tema
4. Use o modo Quiz para testar`
  };
}

function enviarPergunta() {
  const pergunta = perguntaInput.value.trim();
  const materia = materiaSelect.value;
  const modo = modoSelect.value;

  if (!pergunta) {
    alert("Digite uma pergunta ou tema para estudar.");
    return;
  }

  addUserMessage(pergunta);
  perguntaInput.value = "";
  addTemporaryAiMessage();

  setTimeout(() => {
    removeTemporaryAiMessage();
    const resposta = gerarResposta(materia, modo, pergunta);
    addAiMessage(resposta.titulo, resposta.conteudo);
  }, 700);
}

function limparChat() {
  chatArea.innerHTML = `
    <div class="message ai">
      <div class="message-avatar">S+</div>
      <div class="message-bubble">
        <h3>Chat limpo</h3>
        <p>Envie uma nova pergunta para continuar estudando com o Study+.</p>
      </div>
    </div>
  `;
}

enviarBtn.addEventListener("click", enviarPergunta);

perguntaInput.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    enviarPergunta();
  }
});

limparBtn.addEventListener("click", limparChat);
