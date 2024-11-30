const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid'); // For generating unique user IDs

function initWebSocketServer(server) {
    const wss = new WebSocket.Server({ server });

    // Track clients and unread messages
    const clients = {
        admin: null,             // Only one admin
        customers: new Map()     // Each customer has a unique ID or name
    };
    const unreadMessages = new Map(); // Track unread messages by user ID or name

    wss.on('connection', (ws, req) => {
        // Get role, userId (if exists), and name from URL parameters
        const urlParams = new URLSearchParams(req.url.split('?')[1]);
        const role = urlParams.get('role');
        const customerName = urlParams.get('name') || `Customer-${uuidv4().slice(0, 5)}`; // Generate name if not logged in
        
        let userId;
        if (role === 'admin') {
            userId = 'admin';
            clients.admin = ws;
            console.log('Admin connected');
        } else {
            userId = uuidv4(); // Unique ID for each customer session
            clients.customers.set(userId, { ws, name: customerName });
            unreadMessages.set(userId, 0); // Initialize unread message count
            console.log(`Customer connected with ID: ${userId} and name: ${customerName}`);
        }

        ws.on('message', (message) => {
            const parsedMessage = JSON.parse(message);

            if (role === 'customer' && clients.admin) {
                // Forward customer message to admin with customer's name
                clients.admin.send(JSON.stringify({
                    senderId: userId,
                    senderName: customerName,
                    message: parsedMessage.message
                }));
                unreadMessages.set(userId, unreadMessages.get(userId) + 1); // Update unread count
            } else if (role === 'admin') {
                // Forward admin message to a specific customer
                const recipientId = parsedMessage.recipientId;
                const customer = clients.customers.get(recipientId);

                if (customer && customer.ws.readyState === WebSocket.OPEN) {
                    customer.ws.send(JSON.stringify({
                        sender: 'admin',
                        message: parsedMessage.message
                    }));
                    unreadMessages.set(recipientId, 0); // Reset unread count when admin replies
                }
            }
        });

        ws.on('close', () => {
            if (role === 'admin') {
                clients.admin = null;
                console.log('Admin disconnected');
            } else {
                clients.customers.delete(userId);
                unreadMessages.delete(userId);
                console.log(`Customer disconnected with ID: ${userId} and name: ${customerName}`);
            }
        });
    });

    console.log('WebSocket server is running');
}

module.exports = { initWebSocketServer };