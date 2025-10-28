import { useEffect, useState } from "react";
import type { Container } from "../../types/Container.type";
import ContainerItem from "./ContainerItem";

interface ContainersListProps {
  search: string | "";
}

export default function ContainersList(props: ContainersListProps) {
  const [containers, setContainers] = useState<Container[]>();
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchData = () => {
      let url = `${API_URL}/api/containers`;
      if (props.search !== "")
        url += `?q=${props.search}`

      fetch(url)
        .then(res => res.json())
        .then(setContainers)
        .catch(console.error);
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [props.search]);

  return (
    <div className="flex flex-wrap gap-3">
      {containers &&
        containers.map(c => (
          <ContainerItem key={c.Id} container={c} />
        ))}
    </div>
  );
}
