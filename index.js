const express = require('express');
const path = require('path');

const app = express();

// Middleware para ver las acciones en la terminal
app.use((req, res, next) => {
    console.log(`Solicitante: ${req.method} ${req.url}`);
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages/home.html'));
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
