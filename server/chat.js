async function handleChat(req, res) {
    try {
        const { message, preferences, history } = req.body;

        if (!message || typeof message !== String) {
            return res.status(400).json({ error: "Message must be a string" });
        }
        if (!preferences || typeof preferences !== 'object') {
            return res.status(400).json({ error: "Preferences must be an object" });
        }
        if (!history || typeof history !== 'array') {
            return res.status(400).json({ error: "History must be an array" });
        }

        const response = await getGeminiResponse(message, preferences, history);
    }
    catch (error) {
        console.error("Error while calling API", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export { handleChat };