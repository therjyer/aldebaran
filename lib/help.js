const showAll = `*Ver tudo?*
Manda um _!help_`;

function help() {
	return `
*=== Menu do BOT! ===*

Opa! Eu faço muitas coisas.
escolha uma das categorias:

*# Áudios do bot* 🔈
Manda _!help audios_

*# Figurinhas* 📄
Manda _!help figurinhas_

*# Bater-papo* 🧑🏾‍🤝‍🧑🏽
Manda _!help papo_

*# Outros comandos* 📚
Manda _!help outros_

*# Para grupos* 📚
Manda _!help grupos_
----------------------
╿
╿
╰╼ Sou Italo, o bot de vocês! `;
}

const helpers = {
	help: help(),
	helpAudios: helpAudios(),
	helpFigurinhas: helpFigurinhas(),
	helpPapo: helpPapo(),
	helpOutros: helpOutros(),
	helpGrupos: helpGrupos(),
	readme: readme()
}

function helpAudios() {
	return `
*=== Áudios do BOT! ===*

▫️ toca o berrante
▫️ trem bala
▫️ bom dia
▫️ acorda
▫️ acorda corno
▫️ vamos acordar

${showAll}`;
}

function helpFigurinhas() {
	return `
*=== Figurinhas do BOT! ===*

▫️ Figurinha comum:
  Mande uma foto e digite _!s_ na legenda
▫️ Figurinha animada:
  Mande um gif e digite _!sg_ na legenda

${showAll}`;
}

function helpPapo() {
	return `
*=== Bater-papo do BOT! ===*

▫️ sextou
▫️ bom dia bot
▫️ boa tarde bot
▫️ boa noite bot
▫️ fala bot
▫️ que dia é hoje

${showAll}`;
}

function helpOutros() {
	return `
*=== Outros comandos do BOT! ===*

▫️ !concursos .seu estado
▫️ !cep cep
▫️ !clima .sua cidade
▫️ !buscameme
▫️ !escrevememe .texto1 .texto2 .id da imagem
▫️ !tts isso converte texto em audio
▫️ !meunumero
▫️ !aniversário DD/MM/AAAA (o ano deve ser o do próximo aniversário)
▫️ !converter .BTCxUSD

${showAll}`;
}

function helpGrupos() {
const unused = `▫️ !adicionar 55219********`;
	return `
*=== Comandos para grupos ===*

▫️ !adminlista
▫️ !donodogrupo
▫️ !mencionartodos
▫️ !ban @usuário
▫️ !promover
▫️ !rebaixar
▫️ !linkdogrupo

${showAll}`;
}

function readme() {
	return `
*=== README do BOT! ===*
Sou o Italo, um bot para whatsapp de código aberto.
Criado pelo Jhon e aprimorado pelo Kauã, Pedro e Thiago.`;
}

export default helpers
