import { ContextMenu } from "radix-ui";
import type { Container } from "../../types/Container.type";
import defaultWave from "../../assets/images/default-container.png";

interface ContainerRowProps {
    container: Container;
}

interface ContainerRequestProps {
    containerId: string
}

const ContainerItem: React.FC<ContainerRowProps> = ({ container }) => {
    const API_URL = import.meta.env.VITE_API_URL;

    const statusColor: Record<string, string> = {
        running: "bg-green-500 animate-pulse shadow-[0_0_8px_1px_rgba(34,197,94,0.6)]",
        exited: "bg-red-500 shadow-[0_0_8px_1px_rgba(239,68,68,0.6)]",
        paused: "bg-yellow-400 shadow-[0_0_8px_1px_rgba(250,204,21,0.6)]",
        restarting: "bg-blue-400 animate-pulse shadow-[0_0_8px_1px_rgba(96,165,250,0.6)]",
        created: "bg-gray-400 shadow-[0_0_8px_1px_rgba(156,163,175,0.5)]",
    };
    const colorClass = statusColor[container.State] || "bg-gray-400";

    const startContainer = async (props: ContainerRequestProps) => {
        const url = `${API_URL}/api/containers/${props.containerId}/start`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!response.ok) {
            console.log(`Something went wrong starting container - ${props.containerId}: ${response.status}`);
        }
    }

    const stopContainer = async (props: ContainerRequestProps) => {
        const url = `${API_URL}/api/containers/${props.containerId}/stop`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!response.ok) {
            console.log(`Something went wrong starting container - ${props.containerId}: ${response.status}`);
        }
    }

    return (
        <>
            <ContextMenu.Root>
                <ContextMenu.Trigger asChild>
                    <section className="rounded-sm hover:bg-white/50 hover:cursor-pointer flex flex-col justify-center items-center w-30 h-30 text-black relative bg-white/25">
                        <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${colorClass}`} title={container.State} />
                        <img className="w-15 text-black"
                            src={`https://cdn.simpleicons.org/${container.Image.split(":")[0]}`}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = defaultWave;
                            }}
                            alt={container.Image}></img>
                        <p className="text-pretty max-w-20 break-all hyphens-manual">{container.Names[0].substring(1)}</p>
                    </section>
                </ContextMenu.Trigger>

                <ContextMenu.Portal>
                    <ContextMenu.Content className="min-w-[160px] bg-[#393c3e] text-white shadow-lg/25 drop-shadow-2xl rounded-md p-1">

                        <ContextMenu.Item onClick={() => startContainer({ containerId: container.Id })} className="px-3 py-2 hover:bg-gray-100/25 cursor-pointer">
                            <div>Start Container</div>
                        </ContextMenu.Item>
                        <ContextMenu.Item onClick={() => stopContainer({ containerId: container.Id })} className="px-3 py-2 hover:bg-gray-100/25 cursor-pointer">
                            <div>Stop Container</div>
                        </ContextMenu.Item>

                    </ContextMenu.Content>
                </ContextMenu.Portal>
            </ContextMenu.Root>

        </>
    );
};

export default ContainerItem;