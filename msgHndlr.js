import { decryptMedia } from '@open-wa/wa-decrypt';
import { Client } from '@open-wa/wa-automate'
import fs from 'fs-extra';
const { readFileSync, writeFileSync, ReadStream, WriteStream, createWriteStream, unlink } = fs
import axios from 'axios';
const { get } = axios;
import moment from 'moment-timezone'
const { tz } = moment;
import color from './lib/color.js';
import  helpers  from './lib/help.js';
import { resolve as _resolve, dirname } from 'path';
import 'dotenv/config';
// import { removeBackgroundFromImageFile } from 'remove.bg'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import {getVideoId, searchVideo} from './youtube/youtubeCommandsHandler.js'
import downloadMp4 from './youtube/mp4/downloadMp4.js'
import {downloadMp3} from './youtube/mp3/downloadMp3.js'
import http from 'http';
import https from 'https';
import { parse as urlParse, fileURLToPath } from 'url';

import { getAudioUrl } from 'google-tts-api'; 

import { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_PROJECT_ID, DF_LANGUAGE_CODE } from './config.js';

tz.setDefault('America/Sao_Paulo').locale('pt-br');

const credentials = {
	client_email: GOOGLE_CLIENT_EMAIL,
	private_key: GOOGLE_PRIVATE_KEY,
};

const bannedUsers = [
	'5521976607557@c.us', // Albarran
];
const silenceBannedUsers = [
	'558893752311-1627929773@g.us', // Jersu
	'555591441492-1588522560@g.us', // Code Monkey
	// '553195360492-1623288522@g.us', // Grupo dos bots
	'5511982465579-1568231201@g.us', // CanalTech Ofertas
]

const msgHandler = async (client = new Client(), message) => {
	try {
		const { urlParametro, type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message;
		let { body } = message;
		const { name, formattedTitle } = chat;
		let { pushname, verifiedName } = sender;
		pushname = pushname || verifiedName;
		const commands = caption || body || '';
		const falas = commands.toLowerCase().trim();
		const command = getCommand(commands)
		const args = commands.split(' ');

		if (silenceBannedUsers.includes(chat.id)) {
			return;
		}
		
		console.log('----------------------------------------');
		const msgs = (specifiedCommand) => {
			if (command.startsWith('!')) {
				if (specifiedCommand.length >= 10) {
					return `${specifiedCommand.substr(0, 15)}`;
				} else {
					return `${specifiedCommand}`;
				}
			}
		};

		const mess = {
			wait: '⏳ Fazendo figurinha...',
			error: {
				St: '[❗] Envie uma imagem com uma legenda *!s* ou marque a imagem que já foi enviada',
			},
		};

		const time = moment(t * 1000).format('DD/MM HH:mm:ss');
		const botNumber = await client.getHostNumber();
		const blockNumber = await client.getBlockedIds();
		const groupId = isGroupMsg ? chat.groupMetadata.id : '';
		const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : '';
		const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false;
		const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false;
		const ownerNumber = ['5585987119835@c.us', '5585987119835']; // replace with your whatsapp number
		const liderNumber = ['5585987119835@c.us', '5585987119835']; // replace with your whatsapp number

		const isOwner = ownerNumber.includes(sender.id);
		const isBlocked = blockNumber.includes(sender.id);
		const uaOverride =
			'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36';
		const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi);
		if (!isGroupMsg && command.startsWith('!'))
			console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command)), 'from', color(pushname));
		if (isGroupMsg && command.startsWith('!'))
			console.log(
				'\x1b[1;31m~\x1b[1;37m>',
				'[\x1b[1;32mEXEC\x1b[1;37m]',
				time,
				color(msgs(command)),
				'from',
				color(pushname),
				'in',
				color(formattedTitle)
			);
		//if (!isGroupMsg && !command.startsWith('!')) console.log('\x1b[1;33m~\x1b[1;37m>', '[\x1b[1;31mMSG\x1b[1;37m]', time, color(body), 'from', color(pushname))
		
		if (isGroupMsg && !command.startsWith('!'))
				console.log('\x1b[1;33m~\x1b[1;37m>', '[\x1b[1;31mMSG\x1b[1;37m]', time, color(body), 'from', color(pushname), 'in', color(formattedTitle));
		if (isBlocked) return;
		//if (!isOwner) return

		
		// console.log('FROM 		===>', color(pushname));
		// console.log('FROM_ID 	===>', chat.id);
		// console.log('ARGUMENTOS	===>', color(args));
		// console.log('FALAS 		===>', color(falas));
		// console.log('COMANDO 	===>', color(command));

		
		if (command.startsWith('!') && bannedUsers.includes(chat.id)) {
			await client.sendText(from, '*_Você foi banido, não pode usar o bot. :(_*', id);
			console.log("USUÁRIO BANIDO!");
			return;
		}
		
		if(falas.includes('Vai te lascar') && from.includes('7499409161'))
			return client.reply(from, 'Para de xingar bahiana danada', id);

		switch (falas) {
			case 'me ajuda bot':
			case 'me ajuda':
			case 'bot me ajuda':
				await client.sendText(from, helpers.help);
				break;

			case '!berrante':
			case 'toca berrante':
			case 'toca o berrante':
			case 'bot toca berrante':
			case 'toca o berrante bot':
			case 'toca o berrante savio':
				await client.sendFile(from, './media/berrante.mpeg', 'Toca o berrante seu moço', 'AAAAAAAAAUHHH', id);
				break;

			case 'vamos acordar':
				await client.sendFile(from, './media/vamoacordar.mpeg', 'Vamos acordar porra', 'AAAAAAAAAUHHH', id);
				break;

			case 'bom dia':
				await client.reply(from, `Bom dia ${pushname}!`, id);
				break;

			case 'acorda corno':
				await client.sendFile(from, './media/acordaCorno.mpeg', 'Acorda corno', 'AAAAAAAAAUHHH', id);
				break;

			case 'acorda':
				await client.sendFile(from, './media/acorda.mpeg', 'Acorda', 'AAAAAAAAAUHHH', id);
				break;

			case 'sexto':
			case 'sextou':
			case 'sextô':
			case 'sextôu':
				if (moment().format('dddd') == 'sexta-feira') {
					await client.reply(from, 'ôpa, bora??', id);
					const gif1 = readFileSync('./media/sexto.webp', { encoding: 'base64' });
					await client.sendImageAsSticker(from, `data:image/gif;base64,${gif1.toString('base64')}`);
				} else {
					await client.reply(from, `Uai, hoje ainda e ${moment().format('dddd')} e você já ta procurando sexta-feira?....`, id);
				}

				break;
			case 'boa tarde bot':
				await client.reply(from, `Boa tarde ${pushname}, são ${moment().format('HH:mm')} e vc ta ai atoa ne?`, id);
				break;

			case 'boa noite bot':
				await client.reply(from, `Boa noite pra você também, ${pushname}! já são ${moment().format('HH:mm')} to indo nessa também...`, id);
				break;

			case 'que dia e hoje bot':
			case 'que dia é hoje bot':
			case 'oi bot que dia é hoje?':
			case 'que dia e hoje?':
			case 'que dia é hoje?':
				await client.reply(from, `Tem calendário não? hoje é dia ${moment().format('DD/MM/YYYY HH:mm:ss')}`, id);
				break;

			case 'oi bot':
				await client.reply(from, 'Fala? que ta pegando? sei fazer algumas coisas, digite: *me ajuda*', id);
				break;

			case 'como vc está bot?':
			case 'como vai bot?':
			case 'bot como vc está?':
			case 'bot como vai?':
			case 'oi bot como vai?':
			case 'bot como vc esta?':
			case 'oi bot como vc esta?':
			case 'oi bot como vc ta?':
				const gif99 = readFileSync('./media/tranquilao.webp', { encoding: 'base64' });
				await client.sendImageAsSticker(from, `data:image/gif;base64,${gif99.toString('base64')}`);
				break;

			case 'fala bot':
				await client.reply(from, 'Fala você... ou digite: !ajuda', id);
				const gif4 = readFileSync('./media/pensando.webp', { encoding: 'base64' });
				await client.sendImageAsSticker(from, `data:image/gif;base64,${gif4.toString('base64')}`);
				break;
			case 'shalom':
			case 'shalon':
				await client.reply(from, 'Shalom para você também', id);
				break;
		}

		command.replaceAll('_', '');
		command.replaceAll('*', '');
		command.replaceAll('`', '');
		switch (command) {
			case '!dialogflow':
				if (args.length === 1) return client.reply(from, 'Escolha habilitar ou desabilitar!', id);
				if (!isGroupAdmins) return client.reply(from, 'Este comando só pode ser usado por administradores de grupo', id);

				if (args[1].toLowerCase() === 'enable') {
					writeFileSync('./lib/dialogflowActive.json', JSON.stringify({ ativo: 'true' }));
					await client.reply(from, 'O dialogflow ativado com sucesso.', id);
				} else {
					writeFileSync('./lib/dialogflowActive.json', JSON.stringify({ ativo: 'false' }));
					await client.reply(from, 'O dialogflow desabilitado com sucesso.', id);
				}

				break;
			
			case '!about':
			case '!readme':
				await client.sendText(from, helpers.readme, id);
				break;

			case '!concursos':
			case '!concurso':
				if (args.length === 1) return client.reply(from, 'Preciso de um estado para localizar os concursos...', id);

				let request = await get(
					`https://especiais.g1.globo.com/economia/concursos-e-emprego/lista-de-concursos-publicos-e-vagas-de-emprego/data/data.json`
				);
				let cidadeConcurso = body.split('.');
				let concursos = request?.data?.docs;

				let encontrado = ``;
				let quantidade = 0;
				console.log(concursos);

				concursos.forEach(async (data) => {
					if (String(data?.estado.toLowerCase()) == String(cidadeConcurso[1].toLowerCase())) {
						quantidade++;
						encontrado += `\n*Status*: ${data?.tipo}\n*Instituicao:* ${data?.instituicao}\n*Inicio:* ${
							data?.inicio ? data?.inicio + '/' : 'Sem previsão'
						} *Fim:* ${data?.encerramento}\n*Vagas:* ${data?.vagas}\n*Salário:* ${data?.salario}\n*Escolaridade:* ${data.escolaridade}\n*Local:* ${
							data.local
						} / *Estado:* ${data.estado}\n*Link:* ${data.link}\n-------\n`;
					}
				});

				await client.reply(from, `Pera ai, procurei no G1 e encontrei ${quantidade} concursos...`, id);
				setTimeout(() => client.reply(from, `${encontrado}`, id), 5000);

				break;
			case '!hacknumero':
				//if (!isGroupMsg) return client.reply(from, 'Este recurso não pode ser usado em grupos', id)
				if (!isGroupAdmins) return client.reply(from, 'Este comando só pode ser usado por administradores de grupo', id);
				if (args.length === 1) return client.reply(from, 'Preciso de um número pra localizar...', id);

				let numeroTracker = body.split('.');

				if (typeof numeroTracker[1] == 'undefined') {
					return await client.reply(from, `Coloca um . antes do número`, id);
				}

				await client.reply(from, `*Buscando alvo:* ${numeroTracker[1]}`, id);

				setTimeout(async () => {
					let requestNumero = await get(`http://20.195.194.176/kiny/telefone/api.php?telefone=${numeroTracker[1]}`);
					let dadosEncontrados = requestNumero?.data;
					let resposta = String(dadosEncontrados); //.replace(/<br\s*\/?>/gi, "\n").replace(/<p>/gi, "");

					console.log('AQUI ===>', resposta);

					if (resposta.length > 87) {
						await client.reply(from, `💀 *Pera ai ...*\n Encontrei isso HAHAHAHAHAHA..`, id);
						await client.reply(from, `${resposta}`, id);
					} else {
						await client.reply(from, `💀 *Sorte sua, não encontrei nada ${numeroTracker[1]}*`, id);
					}
				}, 5000);

				break;
			case '!tts':
			case 'tts!':
				if (args.length === 1) return client.reply(from, 'Como eu vou adivinhar o devo buscar?', id);
				let string = body.split(' ').slice(1).join(' ');
				console.log('TTS STRING => ', string);
				if (string.length >= 200) {
					client.reply(from, `Ei man, ta muito grande, quer me bugar??`, id);
					break;
				}
				let url = getAudioUrl(`${string}`, {
					lang: 'pt_BR',
					slow: false,
					host: 'https://translate.google.com',
				});

				const dest = _resolve(__dirname, './media/to/translate.mp3'); // file destination
				await downloadFile(url, dest);
				await client.sendAudio(from, './media/to/translate.mp3', 'translate', 'AAAAAAAAAUHHH', id);
				break;

			case '!sorteio':
				try {
					if (args.length === 1) return client.reply(from, 'Adiciona mais informações tipo: _!help cachumba_', id);

					const functionCommand = args[1].toLowerCase();
					const stringTail = args.slice(2)[0]?.toLowerCase();
					const functionNumber = '@' + from.split('-')[0];
					const RaffleComamand = Raffle[functionCommand] || Raffle['-default'];

					const raffleResponse = RaffleComamand(stringTail, pushname || functionNumber, isGroupAdmins);

					client.reply(from, RaffleZaplify(raffleResponse), id);
				} catch (e) {
					client.reply(from, `Deu merda no sorteio man, mostra isso aq pro Pedro...\n ${e}`, id);
				}

				break;

			case '!mp4':
				if (args.length === 1) return client.reply(from, 'Manda aí o titulo ou link do video', id);
				const mp4IdVideo = await getVideoId(args, quotedMsg)
				const mp4Functions = {
					onFinished: () => {
						client.sendFile(from, `./media/ytb/${mp4IdVideo}.mp4`, `videozin`, 'Toma ai seu video 😎👍🏽', id)
					},
					onError: (err) => {
						console.error(err)
						client.reply(from, 'Ocorreu um erro ao pegar o video', id, true)
					}
				}
				downloadMp4(mp4IdVideo, mp4Functions)
				break
			case '!search':
				if (args.length === 1) return client.reply(from, 'Manda aí o titulo ou link do video', id);
				const searchMessage = await searchVideo(args)
				client.reply(from, searchMessage, id)
				break
			case '!mp3':
				if (args.length === 1) return client.reply(from, 'Manda aí o titulo ou link do video', id);
				const idVideo = await getVideoId(args, quotedMsg)

				const functions = {
					onFinished: (err, data) => {
						client.sendAudio(from, `./media/ytb/${data.videoId}.mp3`, id)
					},
					onError: (err) => {
						console.error(err)
						client.reply(from, 'Ocorreu um erro ao pegar o áudio do video', id, true)
					}
				}
				downloadMp3(idVideo,functions)
				client.reply(from, 'Essa é uma boa pedida, vou baixar agora!', id)
				break;
			case '!buscamemes':
			case '!buscameme':
				await client.reply(from, `Vasculhando a internet... pera um pouco`, id);

				let meme = await get(`https://api.imgflip.com/get_memes`);

				let myArray = [];
				meme?.data?.data?.memes.forEach(async (data, index) => {
					myArray.push({ url: data?.url, id: data?.id, name: data?.name });
					myArray = myArray.sort(() => Math.random() - 0.5);
				});

				myArray.forEach(async (data, index) => {
					let urlRandom = myArray[Math.floor(Math.random() * myArray.length)];
					if (index < 6) {
						await client.sendImage(from, `${urlRandom?.url}`, `bot do jhon`, `*ID:* ${urlRandom?.id}\n*REF:* ${urlRandom?.name}`);
					}
				});

				break;

			case '!escrevememe':
				if (args.length === 1)
					return client.reply(from, 'Preciso de 2 textos e o ID da imagem para montar o meme... procure uma imagem !buscameme', id);

				let queryMeme = body.split('.');
				if (queryMeme.length <= 3) return client.reply(from, 'Preciso de todos os parametros para montar o meme', id);

				if (queryMeme[1].length == 0) return client.reply(from, 'Preciso do texto 1...', id);
				if (queryMeme[2].length == 0) return client.reply(from, 'Preciso do texto 2...', id);
				if (queryMeme[3].length == 0 && queryMeme[3].length <= 3) return client.reply(from, 'Preciso de um ID...', id);

				let text0 = queryMeme[1] ?? 'Como eu vou adivinhar';
				let text1 = queryMeme[2] ?? 'O que devo escrever?';
				let text2 = queryMeme[3] ?? '91545132';

				let dataSend = `text0=${encodeURIComponent(text0)}&text1=${encodeURIComponent(text1)}&template_id=${text2}&username=${encodeURIComponent(
					'jhowjhoe'
				)}&password=${encodeURIComponent('sdVKRA2QZm9fQx!')}`;
				let makeMeme = await axios({
					method: 'post',
					url: 'https://api.imgflip.com/caption_image',
					data: dataSend,
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				});

				if (makeMeme?.data?.success != true) return client.reply(from, `${makeMeme?.data?.error_message}`, id);
				await client.sendImage(
					from,
					`${makeMeme?.data?.data?.url}`,
					`bot do pedro`,
					`Pronto, meme gerado com sucesso. você pode visualizar ele aqui nesse site ${makeMeme?.data?.data?.page_url}`
				);

				break;

			case '!clima':
				if (args.length === 1) return client.reply(from, 'Ainda não adivinho coisas... preciso saber a cidade também', id);

				if (typeof args[1] == 'undefined') {
					return await client.reply(from, `Coloca um . antes da cidade`, id);
				}

				let cidade = body.split(' ').slice(1).join(' ');
				if (typeof cidade !== 'undefined') {
					if (cidade.length == 0) return client.reply(from, 'Preciso de uma cidade', id);

					await client.reply(from, `Verificando com São Pedro como está o clima em ${cidade}... pera um pouco`, id);

					let clima = await get(`https://weather.contrateumdev.com.br/api/weather/city/?city=${encodeURI(cidade)}`);

					if (clima?.data?.cod == '404') return await client.reply(from, `Uai... ${clima?.data?.message}`, id);

					await client.sendText(
						from,
						`*Temperatura:* ${clima?.data?.main?.temp} ºC \n*Sensação térmica:* ${clima?.data?.main?.feels_like} ºC \n*Temperatura mínima:* ${clima?.data?.main?.temp_min} ºC \n*Temperatura máxima:* ${clima?.data?.main?.temp_max} ºC \n*Pressão atmosférica:* ${clima?.data?.main?.pressure}\n*Umidade:* ${clima?.data?.main?.humidity}%
----------------------\n${clima?.data?.name} - lat: ${clima?.data?.coord?.lat} lon: ${clima?.data?.coord?.lon}
                `
					);
				} else {
					return client.reply(from, 'Preciso de uma cidade. Ex: _!clima Fortaleza_', id);
				}

				break;
			case '!bateria':
				let level = await client.getBatteryLevel();
				await client.reply(from, `----------------------\nNível de bateria é de: ${JSON.stringify(level)}%\n----------------------`, id);
				break;

			case '!cep':
				if (args.length === 1) return client.reply(from, 'Como eu vou adivinhar o cep?', id);

				let response = await get(`https://viacep.com.br/ws/${args[1]}/json/`);
				const { logradouro, bairro, localidade, siafi, ibge } = response.data;

				await client.reply(from, 'Buscando o CEP... pera um pouco', id);
				await client.sendText(from, `🌎️ Rua: ${logradouro}, ${bairro}, ${localidade}\nSiafi: ${siafi}, Ibge: ${ibge} `);

				break;
			case '!meunumero':
				let chatNumber = sender.id.split('-');
				let ddd = chatNumber[0].substring(2, 4);
				let number = chatNumber[0].substring(4, 12);

				client.reply(from, `Seu numero é: *${number}* seu ddd é: *${ddd}*`, id);

				break;

			case '!kickme':
				client.reply(from, 'Agooora! kkkk', id);

				await client.removeParticipant(groupId, sender.id);

				break;
			case '!sticker':
			case '!stiker':
			case '!s':
			case '!fig':
			case '.fig':
				if (isMedia && type === 'image') {
					const mediaData = await decryptMedia(message, uaOverride);
					const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`;
					await client.sendImageAsStickerAsReply(from, imageBase64,  id,{ author: 'Bot do Pedro Marinho', pack: 'PackDoBot', keepScale: true })
				} else if (quotedMsg && quotedMsg.type == 'image') {
					const mediaData = await decryptMedia(quotedMsg, uaOverride);
					const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`;
					await client.sendImageAsStickerAsReply(from, imageBase64, id, { author: 'Bot do Pedro Marinho', pack: 'PackDoBot', keepScale: true });
				} else if (args.length === 2) {
					const imageUrl = args[1];
					if (imageUrl.match(isUrl)) {
						await client.sendStickerfromUrlAsReply(from, imageUrl, id, { method: 'get' }).catch((err) => console.log('Caught exception: ', err));
					} else {
						client.reply(from, mess.error.Iv, id);
					}
				} else {
					client.reply(from, mess.error.St, id);
				}
				break;
			case '!stickergif':
			case '!stikergif':
			case '!sg':
			case '!sgif':
			case '!sg':
				if (isMedia) {
					if ((mimetype === 'video/mp4' && message.duration < 30) || (mimetype === 'image/gif' && message.duration < 30)) {
						const mediaData = await decryptMedia(message, uaOverride);
						client.reply(from, 'Tô fazendo a figurinha...', id);
						await client.sendMp4AsSticker(from, `data:${mimetype};base64,${mediaData.toString('base64')}`, null, {
							stickerMetadata: true,
							author: 'Bot do Pedro Marinho',
							pack: 'PackDoBot',
							fps: 10,
							square: '512',
							loop: 0,
						});
					}
				}
				else if (quotedMsg) {
					if ((quotedMsg.mimetype === 'video/mp4' && quotedMsg.duration < 30) || (quotedMsg.mimetype === 'image/gif' && quotedMsg.duration < 30)) {
						const mediaData = await decryptMedia(quotedMsg, uaOverride);
						client.reply(from, 'Tô fazendo a figurinha...', id);
						await client.sendMp4AsSticker(from, `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`, null, {
							stickerMetadata: true,
							author: 'Bot do Pedro Marinho',
							pack: 'PackDoBot',
							fps: 10,
							square: '512',
							loop: 0,
						})
					}}
				else client.reply(from, 'Envie o gif com a legenda *!sg* máx. 30 segundos!', id);
				break;
			case '!modoadm':
			case '!autoadm':
				if (!isGroupMsg) return client.reply(from, 'Este comando só pode ser usado em grupos!', id);
				if (!isGroupAdmins) return client.reply(from, 'Este comando só pode ser usado pelo grupo Admin!', id);
				if (args.length === 1) return client.reply(from, 'Escolha habilitar ou desabilitar!', id);

				if (args[1].toLowerCase() === 'enable') {
					welkom.push(chat.id);
					writeFileSync('./lib/welcome.json', JSON.stringify(welkom));
					await client.reply(from, 'O modo auto-adm foi ativado com sucesso neste grupo!', id);
				} else {
					welkom.splice(chat.id, 1);
					writeFileSync('./lib/welcome.json', JSON.stringify(welkom));
					await client.reply(from, 'O recurso de auto-adm foi desabilitado com sucesso neste grupo!', id);
				}

				break;

			case '!linkdogrupo':
			case '!lg':
				if (!isBotGroupAdmins) return client.reply(from, 'Este comando só pode ser usado quando o bot se torna administrador', id);
				if (isGroupMsg) {
					const inviteLink = await client.getGroupInviteLink(groupId);
					client.sendLinkWithAutoPreview(from, inviteLink, `\nLink do grupo: *${name}*`);
				} else {
					client.reply(from, 'Este comando só pode ser usado em grupos!', id);
				}
				break;

			case '!adminlista':
				if (!isGroupMsg) return client.reply(from, 'Este comando só pode ser usado em grupos!', id);
				let mimin = '';
				for (let admon of groupAdmins) {
					mimin += `➸ @${admon.replace(/@c.us/g, '')}\n`;
				}
				await client.sendTextWithMentions(from, mimin);
				break;

			case '!donodogrupo':
				if (!isGroupMsg) return client.reply(from, 'Este comando só pode ser usado em grupos!', id);
				const Owner_ = chat.groupMetadata.owner;
				await client.sendTextWithMentions(from, `Dono do grupo: @${Owner_}`);
				break;

			case '!mencionartodos':
			case '.tagall':
			case '!tagall':
				if (!isGroupMsg) return client.reply(from, 'Este comando só pode ser usado em grupos!', id);
				if (!isGroupAdmins) return client.reply(from, 'Este comando só pode ser usado por administradores de grupo', id);
				const groupMem = await client.getGroupMembers(groupId);
				let hehe = '╔══✪〘 Chamada geral 〙✪══\n';
				for (let group of groupMem) {
					hehe += '╠➥';
					hehe += ` @${group.id.replace(/@c.us/g, '')}\n`;
				}
				hehe += '╚═〘 Verificação de inatividade 〙';
				await client.sendTextWithMentions(from, hehe);
				break;

			case '!adicionar':
			case '!add':
				const orang = args[1];
				if (!isGroupMsg) return client.reply(from, 'Este recurso só pode ser usado em grupos', id);
				if (args.length === 1) return client.reply(from, 'Para usar este recurso, envie o comando *!adicionar* 55319xxxxx', id);
				if (!isGroupAdmins) return client.reply(from, 'Este comando só pode ser usado por administradores de grupo', id);
				if (!isBotGroupAdmins) return client.reply(from, 'Este comando só pode ser usado quando o bot se torna administrador', id);
				try {
					await client.addParticipant(from, `${orang}@c.us`);
				} catch {
					await client.reply(from, mess.error.Ad, id);
				}
				break;

			case '!ban':
			case '.ban':
				if (!isGroupMsg) return client.reply(from, 'Este recurso só pode ser usado em grupos', id);
				if (!isGroupAdmins) return client.reply(from, 'Este comando só pode ser usado por administradores de grupo', id);
				if (!isBotGroupAdmins) return client.reply(from, 'Este comando só pode ser usado quando o bot se torna administrador', id);
				console.log("Vai banir")
				console.log(mentionedJidList)
				if(quotedMsg) {
					const banUser = quotedMsg.author;
					const banUserName = quotedMsg.sender.pushname;
					console.log("banUser:", banUser,banUserName )

					if (banUser == sender.id) return client.reply(from, 'Banindo a si mesmo? Ta loko?!', id);
					if (banUser == chat.groupMetadata.owner) return client.reply(from, 'Você não pode banir o dono do grupo', id);
					if (mentionedJidList.includes(ownerNumber[0])) return client.reply(from, 'Sabe algo que não vou fazer? Banir a mim mesmo!', id);
					if (mentionedJidList.includes(liderNumber[0])) return client.reply(from, 'Sabe algo que não vou fazer? Banir a mim mesmo!', id);
					await client.sendText(from, `Adeus ${banUserName}`);
					await client.sendText(banUser, `Decidimos baní-lo do grupo ${formattedTitle}, lamento. 😿`);
					console.log(await client.removeParticipant(groupId, banUser));
				} else {
					if (mentionedJidList.length === 0) return client.reply(from, 'Para usar este comando, envie o comando *!ban* @tagmember', id);
					if (mentionedJidList.includes(chat.groupMetadata.owner)) return client.reply(from, 'Você não pode banir o dono do grupo', id);
					if (mentionedJidList.includes(ownerNumber[0])) return client.reply(from, 'Sabe algo que não vou fazer? Banir a mim mesmo!', id);
					if (mentionedJidList.includes(liderNumber[0])) return client.reply(from, 'Sabe algo que não vou fazer? Banir a mim mesmo!', id);
					console.log("chegou aqui")
					for (let mentioned of mentionedJidList) {
						console.log(mentioned)
						if (groupAdmins.includes(mentioned)) return client.reply(from, mess.error.Ki, id);
						await client.sendText(mentioned, `Você foi banido do grupo ${formattedTitle}, lamento. 😿`);
						console.log('BANIDO ===>', mentioned.replace(/@c.us/g, ''));
						console.log(await client.removeParticipant(groupId, mentioned));
					}
				}

				break;

			case '!sair':
				if (!isGroupMsg) return client.reply(from, 'Este comando só pode ser usado em grupos', id);
				if (!isGroupAdmins) return client.reply(from, 'Este comando só pode ser usado por administradores de grupo', id);
				await client.sendText(from, 'Sayonara').then(() => client.leaveGroup(groupId));
				break;

			case '!promover':
				if (!isGroupMsg) return client.reply(from, 'Este recurso só pode ser usado em grupos', id);
				if (!isGroupAdmins) return client.reply(from, 'Este recurso só pode ser usado por administradores de grupo', id);
				if (!isBotGroupAdmins) return client.reply(from, 'Este recurso só pode ser usado quando o bot se torna administrador', id);
				if (mentionedJidList.length === 0) return client.reply(from, 'Para usar este recurso, envie o comando *!promover* @tagmember', id);
				if (mentionedJidList.length >= 2) return client.reply(from, 'Desculpe, este comando só pode ser usado por 1 usuário.', id);
				if (groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Desculpe, o usuário já é um administrador.', id);
				await client.promoteParticipant(groupId, mentionedJidList[0]);
				await client.sendTextWithMentions(from, `Comando aceito, adicionado @${mentionedJidList[0]} como admin.`);
				break;

			case '!rebaixar':
				if (!isGroupMsg) return client.reply(from, 'Este recurso só pode ser usado em grupos', id);
				if (!isGroupAdmins) return client.reply(from, 'Este recurso só pode ser usado por administradores de grupo', id);
				if (!isBotGroupAdmins) return client.reply(from, 'Este recurso só pode ser usado quando o bot se torna administrador', id);
				if (mentionedJidList.length === 0) return client.reply(from, 'Para usar este recurso, envie o comando *!rebaixar* @tagadmin', id);
				if (mentionedJidList.length >= 2) return client.reply(from, 'Desculpe, este comando só pode ser usado com 1 pessoa.', id);
				if (!groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Maaf, user tersebut tidak menjadi admin.', id);
				await client.demoteParticipant(groupId, mentionedJidList[0]);
				await client.sendTextWithMentions(from, `Pedido recebido, excluir trabalho @${mentionedJidList[0]}.`);
				break;

			case '!apagar':
				if (!isGroupMsg) return client.reply(from, 'Este recurso só pode ser usado em grupos', id);
				if (!quotedMsg) return client.reply(from, 'Como vou saber o que devo apagar? Mencione uma mensagem minha', id);
				const quotedMsgText = quotedMsg.body;
				const quotedMsgIsConsulta = quotedMsgText.includes('=== CONSULTA REALIZADA ===');
				if (!quotedMsgIsConsulta && !isGroupAdmins) return client.reply(from, 'Este recurso só pode ser usado por administradores de grupo', id);

				if (isGroupAdmins) {
					await client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false);
				} else {
					if (quotedMsgIsConsulta) {
						const consultedFrom = quotedMsgText.split('Consultado por: ')[1];
						if (consultedFrom == pushname || pushname == 'Pedro Marinho') {
							await client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false);
						} else {
							return client.reply(from, 'Essa consulta não é sua, peça a um admin.', id);
						}
					} else {
						if (!quotedMsgObj.fromMe) return client.reply(from, 'Eu não consigo deletar a mensagem de outro usuário!', id);
					}
				}
				return client.reply(from, 'Este recurso só pode ser usado por administradores de grupo ou consultas feitas por você.', id);

			case '!ajuda':
			case '!menu':
			case '!help':
				const helpMode = args[1];

				if(!helpMode) {
					await client.reply(from, helpers.help, id);
				} else {
					helpMode == 'audios' && await client.reply(from, helpers.helpAudios, id);
					helpMode == 'figurinhas' && await client.reply(from, helpers.helpFigurinhas, id);
					helpMode == 'papo' && await client.reply(from, helpers.helpPapo, id);
					helpMode == 'outros' && await client.reply(from, helpers.helpOutros, id);
					helpMode == 'grupos' && await client.reply(from, helpers.helpGrupos, id);
					helpMode == 'consultas' && await client.reply(from, helpers.helpConsultas, id);
				}
				break;

			case '!xagc':
			case '!agro':
				let sendAgro = await get(`https://api.pancakeswap.info/api/v2/tokens/0xd80bea63a208770e1c371dfbf70cb13469d29ae6`);
				let dadosEncontradosAgro = sendAgro;
				let priceformatAgro = (dadosEncontradosAgro.data.data.price * 1).toFixed(9);

				await client.reply(
					from,
					`Nome: ${dadosEncontradosAgro.data.data.name}\nToken: ${dadosEncontradosAgro.data.data.symbol}\nPreço: ${priceformatAgro}`,
					id
				);

				break;

			case '!price':
				/* if (args.length === 1) return client.reply(from, 'Digite !price .contrato (Ex: bscscan.com/token/>>>0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c<<<)', id)
                let contrato = body.split('.')
                let send = await axios.get(`https://api.pancakeswap.info/api/v2/tokens/${contrato[1]}`)
                let dadosEncontrados = send;
                let priceformat = (dadosEncontrados.data.data.price * 1).toFixed(9);
                await client.reply(from, `Nome: ${dadosEncontrados.data.data.name}\nToken: ${dadosEncontrados.data.data.symbol}\nPreço: ${priceformat}`, id) */

				/* url: "https://api.lunarcrush.com/v2?data=assets&key=pow9wvn4xxte3do4az7vq&symbol=" + token */

				try {
					if (args.lenght < 10) {
						if (args.length === 1)
							return client.reply(from, 'Digite !price .contrato (Ex: bscscan.com/token/>>>0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c<<<)', id);
						let contrato = body.split('.');
						let send = await get(`https://api.pancakeswap.info/api/v2/tokens/${contrato[1]}`);
						let dadosEncontrados = send;
						let priceformat = (dadosEncontrados.data.data.price * 1).toFixed(9);

						await client.reply(
							from,
							`Nome: ${dadosEncontrados.data.data.name}\nToken: ${dadosEncontrados.data.data.symbol}\nPreço: ${priceformat}`,
							id
						);
					} else {
						if (args.length === 1) return client.reply(from, 'Digite !price .ETH', id);
						let parametroLunar = body.split('.');
						let moedaLunar = parametroLunar[1];
						let sendLunar = await get(`https://api.lunarcrush.com/v2?data=assets&key=pow9wvn4xxte3do4az7vq&symbol=${moedaLunar}`);
						let dadosEncontradosLunar = sendLunar;

						await client.reply(
							from,
							`Nome: ${dadosEncontradosLunar['data']['data'][0]['name']}\nPreço: ${dadosEncontradosLunar['data']['data'][0]['price']}\nMarketCap: ${dadosEncontradosLunar['data']['data'][0]['market_cap']}\nVolume 24h: ${dadosEncontradosLunar['data']['data'][0]['volume_24h']}\nMax Supply: ${dadosEncontradosLunar['data']['data'][0]['max_supply']}\n`,
							id
						);
					}
				} catch (error) {
					console.error(error);
					await client.reply(from, `Moeda não encontrada!`, id);
				}

				break;

			case '!moeda':
			case '!converter':
			case '!cot':
			case '!cotacao':
				if (args.length === 1) return client.reply(from, 'Digite !converter .BTCxUSD', id);
				let parametro = body.split('.');
				let moeda = parametro[1];

				let parametroBusca = moeda.split('x');

				try {
					console.log(parametroBusca[0]);
					console.log(parametroBusca[1]);

					console.error(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${parametroBusca[0]}&convert=${parametroBusca[1]}`);

					let coinmarketcap = await axios({
						method: 'GET',
						url: `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${parametroBusca[0]}&convert=${parametroBusca[1]}`,
						headers: { 'Content-Type': 'application/json', 'X-CMC_PRO_API_KEY': 'b2776f73-fbda-4b91-8d8b-221be52eb5ff' },
					});

					let coinmarketcapData = coinmarketcap?.data?.data;

					let textoSend = `*Nome:* ${coinmarketcapData[parametroBusca[0]].name}\n*Ranking:* ${
						coinmarketcapData[parametroBusca[0]].cmc_rank != null ? coinmarketcapData[parametroBusca[0]].cmc_rank : 'Sem posição'
					}\n*Sigla:* ${coinmarketcapData[parametroBusca[0]].symbol}\n*Preço:* ${parseFloat(
						coinmarketcapData[parametroBusca[0]].quote[parametroBusca[1]].price
					).toLocaleString('pt-br', { style: 'currency', currency: `${parametroBusca[1]}` })}\n*Volume 24h:* ${parseFloat(
						coinmarketcapData[parametroBusca[0]].quote[parametroBusca[1]].volume_24h
					).toLocaleString('pt-br', { style: 'currency', currency: `${parametroBusca[1]}` })}\n*Suprimento máximo:* ${
						coinmarketcapData[parametroBusca[0]].max_supply != null
							? parseFloat(coinmarketcapData[parametroBusca[0]].max_supply).toLocaleString('pt-br', {
									style: 'currency',
									currency: `${parametroBusca[1]}`,
							  })
							: 'R$ 0,00'
					}\n*Suprimento circulante:* ${parseFloat(coinmarketcapData[parametroBusca[0]].circulating_supply).toLocaleString('pt-br', {
						style: 'currency',
						currency: `${parametroBusca[1]}`,
					})}\n*Suprimento total:* ${parseFloat(coinmarketcapData[parametroBusca[0]].total_supply).toLocaleString('pt-br', {
						style: 'currency',
						currency: `${parametroBusca[1]}`,
					})}\n*Atualização:* ${coinmarketcapData[parametroBusca[0]].quote[parametroBusca[1]]?.last_updated}\n`;

					await client.reply(from, `${textoSend}`, id);
				} catch (error) {
					console.error(error);
					await client.reply(from, `Não achei essa moeda... *${parametroBusca[0]}*, cuidado ao investir!`, id);
				}

				break;
			case '!aniversário':
			case '!aniversario':
				if (args.length === 1) {
					client.reply(from, 'Como eu vou adivinhar a data? Mande no formato DD/MM/YYYY', id);
				} else {
					let date = args[1].split('/');
					let day = date[0];
					let month = date[1];
					let year = date[2];
					if (isNaN(day) || isNaN(month) || isNaN(year)) {
						client.reply(from, 'Essa data tá errada fiote. Mande no formato DD/MM/YYYY', id);
					} else {
						day = parseInt(day);
						month = parseInt(month);
						year = parseInt(year);
						date = new Date(year, month - 1, day);
						let today = new Date();
						let diff = date.getTime() - today.getTime();
						if (diff < 0) return client.reply(from, 'Essa data já passou, lembre-se de colocar o ano do próximo aniversário!', id);
						let days = Math.floor(diff / (1000 * 60 * 60 * 24));
						let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
						let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
						let seconds = Math.floor((diff % (1000 * 60)) / 1000);
						let finalMessage = `Faltam ${days} dias, ${hours} horas, ${minutes} minutos e ${seconds} segundos para o aniversário!`;
						client.reply(from, finalMessage, id);
					}
				}
				break;
			case '!voteban':
				if (!isGroupMsg) return client.reply(from, 'Este recurso só pode ser usado em grupos', id);
				if (mentionedJidList.length === 0) return client.reply(from, 'Para usar este recurso, envie o comando *!voteban* @tagnome', id);
				if (mentionedJidList.length >= 2) return client.reply(from, 'Desculpe, este comando só pode ser usado com 1 pessoa.', id);
				console.log('voteban');
				
				await ReadStream('./voteban.json', 'utf8', (err, data) => {
					console.log("Dados voteban: ", data)
					const user = mentionedJidList[0];
					if (err) return client.reply(`Puts, deu merda não consegui ler a lista de voteban. 😔 \nErro: ${err}`, id);
					let votebanJson = JSON.parse(data);
					console.log("After parse", votebanJson)

					if (votebanJson[groupId][user] === undefined) votebanJson[groupId][user] = [];
					if (votebanJson[groupId][user].includes(pushname)) return client.reply(from, 'Você já votou, seu voto não foi computado, se quiser remover o ban use *!unvoteban*.', id);
					
					votebanJson[groupId][user].push(pushname);

					WriteStream('./voteban.json', JSON.stringify(votebanJson), 'utf8', (err) => {
						if (err) return client.reply(`Vixe, deu merda não consegui salvar o voto. 😔 \nErro: ${err}`, id);
						client.reply(from, `${votebanJson[groupId][user].length}/10 vote ban`, id);
					});

					if (votebanJson[groupId][user].length == 10) {
						client.sendText(from, `${user} foi banido por atingir 10 votos!`);
						client.removeParticipant(groupId, user);
					}
				});
				break;
			case '.toimg':
			case '!toimg':
				const mediaDataSticker = await decryptMedia(message.quotedMsg, uaOverride);
				const imageBase64Sticker = `data:${message.quotedMsg.mimetype};base64,${mediaDataSticker.toString('base64')}`;
				await client.sendImage(from, imageBase64Sticker, 'Imagem do stick','Toma ai o imagem do stick', id)
				break;
			case '!unvoteban':
				if (!isGroupMsg) return client.reply(from, 'Este recurso só pode ser usado em grupos', id);
				if (mentionedJidList.length === 0) return client.reply(from, 'Para usar este recurso, envie o comando *!unvoteban* @tagnome', id);
				if (mentionedJidList.length >= 2) return client.reply(from, 'Desculpe, este comando só pode ser usado com 1 pessoa.', id);
				
				ReadStream('./voteban.json', 'utf8', (err, data) => {
					const user = mentionedJidList[0];
					if (err) return client.reply(`Puts, deu merda não consegui ler a lista de voteban. 😔 \nErro: ${err}`, id);
					let votebanJson = JSON.parse(data);

					if (votebanJson[groupId][user] === undefined) votebanJson[groupId][user] = [];
					if (!votebanJson[groupId][user].includes(pushname)) return client.reply(from, 'Você não votou, seu voto não foi computado, se quiser votar use *!voteban*.', id);
					
					votebanJson[groupId][user].splice(votebanJson[groupId][user].indexOf(pushname), 1);

					WriteStream('./voteban.json', JSON.stringify(votebanJson), 'utf8', (err) => {
						if (err) return client.reply(`Puts, deu merda não consegui salvar o voto. 😔 \nErro: ${err}`, id);
						client.reply(from, `${votebanJson[groupId][user].length}/10 vote ban`, id);
					});
				});
				break;
			case '.tagall':
			}
			} catch (err) {
		await client.sendText(`Puts, deu merda... Erro: ${err}`);

		console.log(color('[ERROR]', 'red'), err);
		client.kill().then((a) => console.log(a));
	}
};

function downloadFile(url, dest) {
	return new Promise((resolve, reject) => {
		const info = urlParse(url);
		const httpClient = info.protocol === 'https:' ? https : http;
		const options = {
			host: info.host,
			path: info.path,
			headers: {
				'user-agent': 'WHAT_EVER',
			},
		};

		httpClient
			.get(options, (res) => {
				// check status code
				if (res.statusCode !== 200) {
					const msg = `request to ${url} failed, status code = ${res.statusCode} (${res.statusMessage})`;
					reject(new Error(msg));
					return;
				}

				const file = createWriteStream(dest);
				file.on('finish', function () {
					// close() is async, call resolve after close completes.
					file.close(resolve);
				});
				file.on('error', function (err) {
					// Delete the file async. (But we don't check the result)
					unlink(dest);
					reject(err);
				});

				res.pipe(file);
			})
			.on('error', reject)
			.end();
	});
}

function getCommand(message) {
	const words = message.toLowerCase().split(' ');
	const wordAtIndex = words.findIndex(e => e.includes("!"));
	if(wordAtIndex === -1) return words[0]
	return words[wordAtIndex].length === 1 ? words[wordAtIndex].concat(words[wordAtIndex+1]) : words[wordAtIndex]
}

export default msgHandler