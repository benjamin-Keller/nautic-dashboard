import type { Container } from "../../types/Container.type";

interface ContainerRowProps {
    container: Container;
}

const ContainerItem: React.FC<ContainerRowProps> = ({ container }) => {
    const statusColor: Record<string, string> = {
        running: "bg-green-500 animate-pulse shadow-[0_0_8px_1px_rgba(34,197,94,0.6)]",
        exited: "bg-red-500 shadow-[0_0_8px_1px_rgba(239,68,68,0.6)]",
        paused: "bg-yellow-400 shadow-[0_0_8px_1px_rgba(250,204,21,0.6)]",
        restarting: "bg-blue-400 animate-pulse shadow-[0_0_8px_1px_rgba(96,165,250,0.6)]",
        created: "bg-gray-400 shadow-[0_0_8px_1px_rgba(156,163,175,0.5)]",
    };
    const colorClass = statusColor[container.State] || "bg-gray-400";

    return (
        <section className="rounded-sm hover:bg-white/50 hover:cursor-pointer flex flex-col justify-center items-center w-30 h-30 text-black relative bg-white/25">
            <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${colorClass}`} title={container.State} />
            <img className="w-15 text-black" src="https://cdn.jsdelivr.net/gh/selfhst/icons/svg/grafana.svg"></img>
            <p className="text-pretty max-w-20 break-all hyphens-manual">{container.Names[0].substring(1)}</p>
        </section>
    );
};

export default ContainerItem;