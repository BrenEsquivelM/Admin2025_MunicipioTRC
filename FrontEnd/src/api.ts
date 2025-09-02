export interface Usuario {
    id: number;
    nombre: string;
}

export async function getUsuarios(): Promise<Usuario[]> {
    const response = await fetch("http://localhost:3000/api/usuarios");
    if(!response.ok){
        throw new Error("Error al obtener usuarios");
    }
    return response.json();
}