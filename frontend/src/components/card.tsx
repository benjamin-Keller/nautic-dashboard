import type { ReactNode } from "react";

interface CardProps {
    children?: ReactNode | undefined;
}

const Card: React.FC<CardProps> = ({ children }) => {
    return (
        <div className="p-5 text-xl text-black font-semibold bg-white/50 rounded-md w-xs text-center content-center">
            {children}
        </div>
    );
}

export default Card;