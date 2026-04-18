require("dotenv").config({ path: require("path").resolve(__dirname, "../../backend/.env") });

const connectDB = require("../../backend/src/config/db");
const { startScheduler } = require("./schedulers/cron");

async function bootstrap() {
	await connectDB();
	startScheduler();
	console.log("Worker started");
}

bootstrap().catch((error) => {
	console.error("Worker failed to start:", error.message);
	process.exit(1);
});
