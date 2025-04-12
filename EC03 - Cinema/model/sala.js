export class Sala{
    constructor(id, nomeSala, capacidade, tipo){
        this.id = id;
        this.nomeSala = nomeSala;
        this.capacidade = capacidade;
        this.tipo = tipo;
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //GET E SET
    getId(){
        return this.id;
    }
    setId(id){
        this.id = id;
    }
    getNumero(){
        return this.nomeSala;
    }
    setNumero(nomeSala){
        this.nomeSala = nomeSala;
    }
    getCapacidade(){
        return this.capacidade;
    }
    setCapacidade(capacidade){
        this.capacidade = capacidade;
    }
    getTipo(){
        return this.tipo;
    }
    setTipo(tipo){
        this.tipo = tipo;
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // toString
    toString(){
        return console.log(`{ ${this.id}, ${this.numero}, ${this.capacidade}, ${this.tipo},`)
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
}