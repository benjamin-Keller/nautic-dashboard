import express from "express";
import Docker from "dockerode";
import cors from "cors";

const app = express();
const docker = new Docker({
  // Use this for Linux/macOS:
  // socketPath: "/var/run/docker.sock",

  // Use this for Windows:
  socketPath: "//./pipe/docker_engine",
});

app.use(cors());

/**
 * Build Docker filters and negations from a query string.
 * Supports:
 *   name:my_app status:running
 *   name:web, name:api
 *   !status:exited
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
    if (key === "image")
      continue;
    const val = value.trim();

    const target = isNegation ? exclude : include;
    if (!target[key]) target[key] = [];
    target[key].push(val);
  }

  return { include, exclude };
}

app.get("/api/containers", async (req, res) => {
  try {
    const query = (req.query.q as string) || ""; // e.g. /api/containers?q=name:app status:running !status:exited
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

app.post("/api/containers/:id/start", async (req, res, _) => {
  try {
    const id = req.params.id;
    const container = docker.getContainer(id);
    console.info(`Starting container - ${id}`);
    container.start((err, data) => {
      console.info(`Started container - ${id}`);
      return;
    });

    res.status(200).send(`Started container - ${id}`);

  } catch (error) {
    console.error("Error starting container:", error);
    res.status(500).json({ error: "Error starting container" });
  }
});

app.post("/api/containers/:id/stop", async (req, res, _) => {
  try {
    const id = req.params.id;
    const container = docker.getContainer(id);
    console.info(`Stopping container - ${id}`);
    container.stop((err, data) => {
      console.info(`Stopped container - ${id}`);
      return;
    });

    res.status(200).send(`Stopped container - ${id}`);

  } catch (error) {
    console.error("Error Stopping container:", error);
    res.status(500).json({ error: "Error Stopping container" });
  }
});

const PORT = 4000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running at http://localhost:${PORT}`)
);
