import { useLocation } from "react-router-dom";

export default function Canvas() {

  const location = useLocation();
  const list = JSON.parse(location.state.list);

  return (
    <div>
      <h1>Canvas</h1>
      <p>{location.state.id}</p>
      <p>{list.map((item) => {return(
        `${item} `
        )
        
      })}</p>
    </div>
  );
}
