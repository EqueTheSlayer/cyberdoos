import { PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { ClientModel } from "../models/client.model";
import nodeHtmlToImage from 'node-html-to-image';
import { getRandomElement, getRandomInt } from '../utils';
import { tolyaDate } from '../models/tolya.model';


const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tolya')
		.setDescription('Делает ваш высер мудрыми словами')
		.addStringOption(option =>
			option.setName('message')
				.setDescription('Ваш высер до импрува')
				.setMaxLength(60)
				.setRequired(true)),
	async execute(interaction, client: ClientModel) {
		try {
			const {guild, member, channel, options} = interaction;
				const avatar = fs.readFileSync('src/TOLYA.webp');
				const base64Image = Buffer.from(avatar).toString('base64');
				const dataURI = 'data:image/jpeg;base64,' + base64Image
				const hours = getRandomInt(24);
				const minutes = getRandomInt(60);
				const answer = options.getString('message');
				const rating = getRandomInt(228);

				const image = await nodeHtmlToImage({
					html: `<html>
							<style>
							@font-face {
       						 font-family: 'Roboto';
        					 src: url('../Roboto-Medium.ttf') format('ttf');  
      						}							
      						
      						* {
      							font-family: 'Roboto', Arial, sans-serif;
      						
      						}
								body {
									padding: 10px 20px;
									position: relative;
									height: 60px;
									width: 600px;
									
								}
								.topRow {
									display: flex;
									margin-bottom: 15px;
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
									font-size: 13px;
								}
								
								.date {
									color: #595959;
									font-size: 12px;
								}
								
								.rating {
									position: absolute;
									right: 20px;
									color: ${rating > 0 ? '#2ea83a' : '#595959'};
									font-size: 14px;
									height: 24px;
								}
								
								.bottomRow {
								 	font-size: 15px;
								}
							</style>
							<body>
								<div class="topRow">
									<img src="${dataURI}" class="image">
									<div class="name">Phobiastrike</div>
									<div class="date">${getRandomInt(28)} ${getRandomElement(tolyaDate)} в ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}</div>
									<div class="rating">${rating}</div>
								</div>
								<div class="bottomRow">${answer}</div>
							</body>
							</html>`
				});

				await interaction.reply({files: [{attachment: image}]});
		} catch
			(e) {
			console.log(e)

			return await interaction.channel.send({content: e, ephemeral: true});
		}
	},
};