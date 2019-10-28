const express = require('express');

const app = express();

app.get('/:id', async (req, res) => {
    try {
        const request = await database.users.findOne({ where: { id: req.params.id } });
        return res.json({ message: request.toJSON() })
    } catch(err) {
        return res.json({ error: 'User was not found.' })
    }
});

module.exports = app;