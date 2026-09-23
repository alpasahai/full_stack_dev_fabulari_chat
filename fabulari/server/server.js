const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
 
app.disable('etag'); // stop Express from caching JSON responses
 
app.use(cors());
app.use(express.json());
 
// serve uploaded images (PFPs now, chat images later)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
 
// belt-and-suspenders: force no caching on every response
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
 
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/channels', require('./routes/channels'));
app.use('/api/uploads', require('./routes/uploads'));
 
const { bootstrapSuperAdmin } = require('./utilities/bootstrap');
bootstrapSuperAdmin();
 
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

