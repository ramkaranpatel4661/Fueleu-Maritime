import "dotenv/config";
import { createApp } from "./infrastructure/server/app";

const PORT = process.env.PORT || 3001;

const app = createApp();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check available at /health`);
});
