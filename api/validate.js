const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const database = client.db('license_db');
        const licenses = database.collection('keys');

        const { key } = req.query;
        if (!key) return res.status(400).json({ status: "error", message: "No key provided" });

        const findKey = await licenses.findOne({ license_key: key });

        if (findKey) {
            res.json({ status: "success", valid: true });
        } else {
            res.json({ status: "error", valid: false });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await client.close();
    }
};