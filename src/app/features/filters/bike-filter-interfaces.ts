// Interfaccia per il filtro del tipo di bicicletta
export interface TypeFilter {
    id: number;
    name: string;
}
// Interfaccia per il filtro del colore di bicicletta
export interface ColorFilter{
    color:string;
}
// Interfaccia per il filtro della taglia della bicicletta
export interface SizeFilter{
    size:string;
}
//interfaccia per il filtro del prezzo della bicicletta
export interface PriceFilter{
    id:number;
    label:string,
}
