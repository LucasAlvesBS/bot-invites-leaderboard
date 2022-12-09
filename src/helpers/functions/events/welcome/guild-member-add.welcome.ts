import { Canvas, createCanvas, loadImage } from '@napi-rs/canvas';
import { AttachmentBuilder, Client, TextChannel } from 'discord.js';
import { request } from 'undici';

export const startGuildMemberAddWelcome = (client: Client) => {
  client.on('guildMemberAdd', async member => {
    try {
      const canvas = createCanvas(1024, 500);
      const context = canvas.getContext('2d');

      const backgroundImage = await loadImage('./src/images/darkness.jpg');

      context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

      const applyText = (canvas: Canvas, text: string) => {
        const context = canvas.getContext('2d');

        let fontSize = 60;

        do {
          context.font = `${(fontSize -= 10)}px sans-serif`;
        } while (context.measureText(text).width > canvas.width - 300);

        return context.font;
      };

      context.strokeStyle = '#FFFFFF';
      context.font = applyText(canvas, member.displayName);
      context.fillStyle = '#FFFFFF';
      context.textAlign = 'center';

      context.fillText(
        `${member.displayName} joined ${member.guild.name}`,
        512,
        390,
      );

      context.font = '40px sans-serif';

      context.fillText(`Member #${member.guild.memberCount}`, 512, 450);
      context.strokeRect(0, 0, canvas.width, canvas.height);
      context.beginPath();
      context.arc(512, 166, 119, 0, Math.PI * 2, true);

      context.shadowColor = '#FFFFFF';
      context.shadowBlur = 15;

      context.closePath();
      context.clip();

      const { body } = await request(member.user.displayAvatarURL());
      const avatar = await loadImage(await body.arrayBuffer());

      context.drawImage(avatar, 393, 47, 238, 238);

      const attachment = new AttachmentBuilder(await canvas.encode('png'), {
        name: 'profile-image.png',
      });

      const welcomeChannel = client.channels.cache.get(
        '1031649243594768485',
      ) as TextChannel;

      await welcomeChannel.send({
        files: [attachment],
      });
    } catch (error) {
      console.error(error);
    }
  });
};
