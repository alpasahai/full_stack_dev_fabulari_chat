const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/channels', require('./routes/channels'));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));