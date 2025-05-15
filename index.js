require("dotenv").config();
const express = require("express");
const { Client, GatewayIntentBits, Partials, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, Events, SlashCommandBuilder, REST, Routes, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

// Configurar Express para manter o bot ativo no Render
const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("Bot está rodando!"));
app.listen(PORT, () => console.log(`🚀 Servidor Express rodando na porta ${PORT}`));

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel]
});

const commands = [
  new SlashCommandBuilder()
    .setName("plantacao")
    .setDescription("Registrar plantação"),
  new SlashCommandBuilder()
    .setName("rancho")
    .setDescription("Registrar venda de animais do rancho")
].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
(async () => {
  try {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });
    console.log("✅ Comandos registrados com sucesso!");
  } catch (err) {
    console.error("Erro ao registrar comandos:", err);
  }
})();

client.once("ready", () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "plantacao") {
      const modal = new ModalBuilder()
        .setCustomId("registrar_plantacao")
        .setTitle("Registrar Plantação");

      const sementes = new TextInputBuilder()
        .setCustomId("sementes")
        .setLabel("Quantidade De Sementes Plantadas")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const rendimento = new TextInputBuilder()
        .setCustomId("rendimento")
        .setLabel("Rendimento")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const tipoSemente = new TextInputBuilder()
        .setCustomId("tipo_semente")
        .setLabel("Semente: (Milho, Cana-De-Açúcar)")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const obs = new TextInputBuilder()
        .setCustomId("obs")
        .setLabel("Observações (Opcional)")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false);

      modal.addComponents(
        new ActionRowBuilder().addComponents(sementes),
        new ActionRowBuilder().addComponents(rendimento),
        new ActionRowBuilder().addComponents(tipoSemente),
        new ActionRowBuilder().addComponents(obs)
      );

      await interaction.showModal(modal);
    }

    if (interaction.commandName === "rancho") {
      const modal = new ModalBuilder()
        .setCustomId("registrar_animais")
        .setTitle("Registrar Animais do Rancho");

      const animal = new TextInputBuilder()
        .setCustomId("animal")
        .setLabel("Animal: (Gado, Galinha, Cabra)")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const quantidade = new TextInputBuilder()
        .setCustomId("quantidade")
        .setLabel("Quantidade De Animais")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const valor = new TextInputBuilder()
        .setCustomId("valor")
        .setLabel("Valor De Venda")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const observacoes = new TextInputBuilder()
        .setCustomId("observacoes")
        .setLabel("Observações (Opcional)")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false);

      modal.addComponents(
        new ActionRowBuilder().addComponents(animal),
        new ActionRowBuilder().addComponents(quantidade),
        new ActionRowBuilder().addComponents(valor),
        new ActionRowBuilder().addComponents(observacoes)
      );

      await interaction.showModal(modal);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
