import { PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { ClientModel } from "../models/client.model";
import nodeHtmlToImage from 'node-html-to-image';
import { getRandomElement, getRandomInt } from '../utils';
import { dtfQuoteDate } from '../models/dtfquote.model';


const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dtfquote')
    .setDescription('Цитата лоха с дтф')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Выберете автора цитаты')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Введите цитату')
        .setRequired(true)),
  async execute(interaction, client: ClientModel) {
    try {
      const { guild, member, channel, options } = interaction;
      const hours = getRandomInt(22) + 1;
      const minutes = getRandomInt(58) + 1;
      const answer = await options.getString('message');
      const author = await options.getUser('user');
      const linkToImage = author.displayAvatarURL();
      const authorToMember = guild.members.cache.get(author.id);

      const rating = getRandomInt(228);
      const image = await nodeHtmlToImage({
        html: `<html lang="ru">
							<style>
							@font-face {
       						 font-family: 'Roboto';
        					 src: url('Roboto-Medium.ttf') format('ttf');
      						}

      						* {
      							font-family: 'Roboto', Tahoma, sans-serif;

      						}
								body {
									padding: 10px 20px;
									position: relative;
									width: 600px;
									box-sizing: border-box;
								}
								.topRow {
									display: flex;
									margin-bottom: 12px;
									align-items: center;
								}

								.image {
									margin-right: 10px;
									height: 16px;
									width: 16px;
									border-radius: 2px;
								}

								.name {
									margin-right: 15px;
									font-weight: 700;
									font-size: 14px;
								}

								.date {
									color: #595959;
									font-size: 13px;
								}

								.rating {
									position: absolute;
									right: 20px;
									color: ${rating > 0 ? '#2ea83a' : '#595959'};
									font-size: 15px;
									height: 24px;
								}

								.bottomRow {
								 	font-size: 16px;
								 	line-height: 22px;
								}
							</style>
							<body>
							<div class="commentary">
								<div class="topRow">
									<img src=${linkToImage} class="image" alt="avatar))">
									<div class="name">${authorToMember.nickname}</div>
									<div class="date">${getRandomInt(27) + 1} ${getRandomElement(dtfQuoteDate)} в ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}</div>
									<div class="rating">${rating}</div>
								</div>
								<div class="bottomRow">${answer}</div>
							</div>
							</body>
							<script>
								const element = document.querySelector('.commentary');
                                
                                document.body.style.height = String(element.offsetHeight + 20);
							</script>
							</html>`,
        puppeteerArgs: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] }
      });

      interaction.reply({ files: [{ attachment: image }] });
    } catch
      (e) {
      console.log(e)

      return await interaction.channel.send({ content: e, ephemeral: true });
    }
  },
};