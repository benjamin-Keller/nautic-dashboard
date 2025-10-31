import express from "express";
import Docker from "dockerode";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, sequelize } from "./db";
import { ContainerLogo } from "./models/ContainerLogo";
import axios from "axios";

dotenv.config();

const dockerSocketPath = process.env.DOCKER_SOCKET_PATH;
console.log("🛳️ Using Docker socket:", dockerSocketPath);

const docker = new Docker({ socketPath: dockerSocketPath });

async function startServer() {
  try {
    // Connect to DB
    await connectDB();
    await sequelize.sync();
    console.log("✅ Database connected and models synced.");

    // Initialize express app
    const app = express();

    app.use(
      cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

    app.use(express.json());

    /**
     * Routes
     */
    app.get("/api/logos/:imageName", async (req, res) => {
      try {
        const { imageName } = req.params;

        const existing = await ContainerLogo.findOne({ where: { imageName } });
        if (existing) return res.json(existing);

        const logo = imageName.split("/")[1] ?? imageName.split("/")[0];
        const githubUrl = `https://raw.githubusercontent.com/selfhst/icons/refs/heads/main/svg/${logo}.svg`;

        let finalLogoUrl = githubUrl;
        try {
          const response = await axios.head(githubUrl);
          if (response.status !== 200) throw new Error("File not found");
        } catch {
          finalLogoUrl = "https://raw.githubusercontent.com/benjamin-Keller/nautic-dashboard/refs/heads/main/frontend/src/assets/images/default-container.png";
        }

        const newLogo = await ContainerLogo.create({
          imageName,
          logoUrl: finalLogoUrl,
        });

        console.log(`🖼️ Added logo entry for ${imageName}: ${finalLogoUrl}`);
        res.send(newLogo);

      } catch (err) {
        console.error("Error fetching logo:", err);
        res.status(500).json({ error: "Failed to get logo" });
      }
    });

    app.get("/api/containers", async (req, res) => {
      try {
        const query = (req.query.q as string) || "";
        const { include, exclude } = buildDockerFilters(query);

        const containers = await docker.listContainers({
          all: true,
          filters: include,
        });

        const filtered = containers.filter((container) => {
          return Object.entries(exclude).every(([key, values]) => {
            const valMatch = (v: string) => {
              if (key === "name" && container.Names) {
                return container.Names.some((n) =>
                  n.toLowerCase().includes(v.toLowerCase())
                );
              }
              if ((container as any)[key]) {
                return (container as any)[key]
                  .toString()
                  .toLowerCase()
                  .includes(v.toLowerCase());
              }
              return false;
            };
            return !values.some(valMatch);
          });
        });

        res.json(filtered);
      } catch (error) {
        console.error("Error listing containers:", error);
        res.status(500).json({ error: "Failed to list containers" });
      }
    });

    app.post("/api/containers/:id/start", async (req, res) => {
      try {
        const id = req.params.id;
        const container = docker.getContainer(id);
        console.info(`Starting container - ${id}`);
        await container.start();
        res.status(200).send(`Started container - ${id}`);
      } catch (error) {
        console.error("Error starting container:", error);
        res.status(500).json({ error: "Error starting container" });
      }
    });

    app.post("/api/containers/:id/stop", async (req, res) => {
      try {
        const id = req.params.id;
        const container = docker.getContainer(id);
        console.info(`Stopping container - ${id}`);
        await container.stop();
        res.status(200).send(`Stopped container - ${id}`);
      } catch (error) {
        console.error("Error stopping container:", error);
        res.status(500).json({ error: "Error stopping container" });
      }
    });

    app.post("/api/containers/:id/restart", async (req, res) => {
      try {
        const id = req.params.id;
        const container = docker.getContainer(id);
        console.info(`Restarting container - ${id}`);
        await container.restart();
        res.status(200).send(`Restarted container - ${id}`);
      } catch (error) {
        console.error("Error Restarting container:", error);
        res.status(500).json({ error: "Error Restarting container" });
      }
    });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () =>
      console.log(`🚀 Backend running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

/**
 * Helper for Docker filters
 */
function buildDockerFilters(query: string): {
  include: { [key: string]: string[] };
  exclude: { [key: string]: string[] };
} {
  const include: { [key: string]: string[] } = {};
  const exclude: { [key: string]: string[] } = {};

  if (!query.trim()) return { include, exclude };

  const parts = query.split(/[\s,;]+/);

  for (const part of parts) {
    const [keyPart, value] = part.split(":");
    if (!keyPart || !value) continue;

    const isNegation = keyPart.startsWith("!");
    const key = keyPart.replace(/^!/, "").trim();
    if (key === "image") continue;
    const val = value.trim();

    const target = isNegation ? exclude : include;
    if (!target[key]) target[key] = [];
    target[key].push(val);
  }

  return { include, exclude };
}

// Start the async bootstrap
startServer();
