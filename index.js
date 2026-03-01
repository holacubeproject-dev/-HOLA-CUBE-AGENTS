const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
require('dotenv').config();

// Inicializamos el cliente de WhatsApp
// Utilizamos LocalAuth para guardar la sesión en el disco y no tener que escanear el QR cada vez
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Importante para que no de errores silenciosos en algunos sistemas
    }
});

// Cuando el cliente genera el código QR
client.on('qr', (qr) => {
    // Generamos el QR en la terminal para poder escanearlo
    qrcode.generate(qr, { small: true });
    console.log('¡Hola! Escanea este código QR con tu WhatsApp para conectar a HOLACUBEAGENTS.');
});

// Cuando el cliente se autentica correctamente y está listo
client.on('ready', () => {
    console.log('✅ Cliente de HOLACUBEAGENTS está LISTO y conectado a WhatsApp!');
});

// Cuando recibimos un mensaje
client.on('message_create', async (msg) => {
    // Evitamos que el bot se responda a sí mismo
    if (msg.fromMe) return;

    // Solo respondemos a mensajes de texto normales por ahora (ignoramos estados, audios, etc)
    if (msg.type === 'chat') {
        const body = msg.body.toLowerCase();
        console.log(`Mensaje recibido de ${msg.from}: ${msg.body}`);

        // Respuesta básica de prueba antes de conectar la IA
        if (body.includes('hola') || body.includes('info')) {
            await msg.reply('¡Hola! Soy HOLACUBEAGENTS, tu asistente automatizado. (Prueba 1: Conexión exitosa)');
        }
    }
});

// Iniciamos el cliente
client.initialize();
