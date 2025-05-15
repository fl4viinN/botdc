require("dotenv").config();
const { Client, GatewayIntentBits, Partials, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, Events, SlashCommandBuilder, REST, Routes, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

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

  if (interaction.isModalSubmit()) {
    const button = new ButtonBuilder()
      .setCustomId("confirmar_pagamento")
      .setLabel("Confirmar Pagamento")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(button);

    if (interaction.customId === "registrar_plantacao") {
      const sementes = interaction.fields.getTextInputValue("sementes");
      const rendimento = interaction.fields.getTextInputValue("rendimento");
      const tipoSemente = interaction.fields.getTextInputValue("tipo_semente");
      const obs = interaction.fields.getTextInputValue("obs") || "Nenhuma";

      const embed = new EmbedBuilder()
        .setTitle("🌱 Nova Plantação Registrada")
        .addFields(
          { name: "👤 Usuário:", value: `${interaction.user}`, inline: true },
          { name: "🌾 Semente:", value: tipoSemente, inline: true },
          { name: "📦 Quantidade:", value: sementes, inline: true },
          { name: "📈 Rendimento:", value: rendimento, inline: true },
          { name: "📝 Observações:", value: obs },
          { name: "📅 Data:", value: new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }) }
        )
        .setColor(0x00FF00)
        .setFooter({ text: "Fazenda Drake" });

      await interaction.reply({ embeds: [embed], components: [row] });
    }

    if (interaction.customId === "registrar_animais") {
      const animal = interaction.fields.getTextInputValue("animal");
      const quantidade = interaction.fields.getTextInputValue("quantidade");
      const valor = interaction.fields.getTextInputValue("valor");
      const observacoes = interaction.fields.getTextInputValue("observacoes") || "Nenhuma";

      const embed = new EmbedBuilder()
        .setTitle("🐄 Novo Registro do Rancho")
        .addFields(
          { name: "👤 Usuário:", value: `${interaction.user}`, inline: true },
          { name: "🐮 Animal:", value: animal, inline: true },
          { name: "📦 Quantidade:", value: quantidade, inline: true },
          { name: "💰 Valor:", value: valor, inline: true },
          { name: "📝 Observações:", value: observacoes },
          { name: "📅 Data:", value: new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }) }
        )
        .setColor(0xFFA500)
        .setFooter({ text: "Fazenda Drake" });

      await interaction.reply({ embeds: [embed], components: [row] });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
