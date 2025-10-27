import moment from "moment";
import { useEffect, useState, type ChangeEvent } from "react";
import Card from "../card";
import ContainersList from "../container/ContainersList";

export default function Dashboard() {
    const [currentTime, setCurrentTime] = useState(moment());
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchExpanded, setSearchExpanded] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(moment());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const expandSearch = () => {
        setSearchExpanded(!isSearchExpanded);
    }

    return (
        <div className="flex gap-5">
            <div className="flex flex-col gap-3">
                <Card>
                    <div className="w-full max-w-sm min-w-[200px] relative">
                        <input value={searchQuery} onClick={expandSearch} onChange={handleChange} placeholder="Search..." className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" />
                        {/* <section className="absolute bg-red-500 h-[200px] left-0 right-0 shadow-sm focus:shadow">

                        </section> */}
                    </div>
                </Card>
                <Card>
                    <div className="flex flex-col justify-center">
                        <div>{currentTime.format("MMMM DD, YYYY")}</div>
                        <div>{currentTime.format("HH")}<span className="animate-pulse duration-150">:</span>{currentTime.format("mm")}</div>
                    </div>
                </Card>
            </div>
            <div>
                <ContainersList search={searchQuery} />
            </div>
        </div>
    );
}