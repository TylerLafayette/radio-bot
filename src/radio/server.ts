import express from "express";

const app = express();

app.get("/stream", (req, res) => {
	// const responseSink = queue.makeResponseSink();
	// res.setHeader("Content-Type", "audio/mpeg");
	// responseSink.pipe(res);
});

// queue.startStreaming();
app.listen(3031, () => console.log("✅ Stream server running"));
