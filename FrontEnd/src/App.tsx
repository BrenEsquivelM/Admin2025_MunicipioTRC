import { useEffect, useState } from "react";
//import { getUsuarios } from "./api";
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
//import './App.css'


/*interface Usuario{
  id: number;
  nombre: string;
}*/

function App() {
  /*const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [error, setError] = useState<string | null> (null);*/
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/")
    .then(res => {
      console.log("Status:", res.status);
      if(!res.ok){
        throw new Error(`HTTP error! status: ${res.status}`); 
      }
      return res.text();//Aqui explicar miguel 
    })
    
          .then(data  => setMessage(data))
          .catch(err => {
            console.error("Error al obtener datos", err);
            setMessage("Error al obtener datos");
          });
  }, []);

  return (
    <div>
      <h1> PRUEBA CORS</h1>
      <p>{message}</p>
    </div>
  );
}

 /* if(error) return <div> Error: {error}</div>;

  return (
    <div>
      <h1> Listado de reportes</h1>
      <ul>
        {usuarios.map((u) => (
          <li key = {u.id}>{u.nombre}</li>
        ))}
      </ul>
    </div>
  );
}*/

//export default App;
  /*
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>LISTADO DE REPORTES</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}*/

export default App;
