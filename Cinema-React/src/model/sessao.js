export class Sessao{
    constructor(id, filme, sala, data, horario, preco, idioma, formato){
        this.id = id;
        this.filme = filme;
        this.sala = sala;
        this.data = data;
        this.horario = horario;
        this.preco = preco;
        this.idioma = idioma;
        this.formato = formato;
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //GET E SET
    getId(){
        return this.id;
    }
    setId(id){
        this.id = id;
    }
    getFilme(){
        return this.filme;
    }
    setFilme(filme){
        this.filme = filme;
    }
    getSala(){
        return this.sala;
    }
    setSala(sala){
        this.sala = sala;
    }
    getData(){
        return this.data;
    }
    setData(data){
        this.data = data;
    }
    getHorario(){
        return this.horario;
    }
    setHorario(horario){
        this.horario = horario;
    }
    getPreco(){
        return this.preco;
    }
    setPreco(preco){
        this.preco = preco;
    }
    getIdioma(){
        return this.idioma;
    }
    setIdioma(idioma){
        this.idioma = idioma;
    }
    getFormato(){
        return this.formato;
    }
    setFormato(formato){
        this.formato = formato;
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // toString
    toString(){
        return console.log(`{ ${this.id}, ${this.filme}, ${this.sala}, ${this.data}, ${this.horario}, ${this.preco} ${this.idioma}, ${this.formato},`)
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
}