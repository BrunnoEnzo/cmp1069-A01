export class Filme{
    constructor(id,titulo,descricao,genero,classificacao,duracao,dataEstreia){
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.genero = genero;
        this.classificacao = classificacao;
        this.duracao = duracao;
        this.dataEstreia = dataEstreia;
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //GET E SET
    getId(){
        return this.id;
    }
    setId(id){
        this.id = id;
    }
    getTitulo(){
        return this.titulo;
    }
    setTitulo(titulo){
        this.titulo = titulo;
    }
    getDescricao(){
        return this.descricao;
    }
    setDescricao(descricao){
        this.descricao = descricao;
    }
    getGenero(){
        return this.genero;
    }
    setGenero(genero){
        this.genero = genero;
    }
    getClassificacao(){
        return this.classificacao;
    }
    setClassificacao(classificacao){
        this.classificacao = classificacao;
    }
    getDuracao(){
        return this.duracao;
    }
    setDuracao(duracao){
        this.duracao = duracao;
    }
    getDataEstreia(){
        return this.dataEstreia;
    }
    setDataEstreia(dataEstreia){
        this.dataEstreia = dataEstreia;
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // toString
    toString(){
        return console.log(`{ ${this.id}, ${this.titulo}, ${this.genero}, ${this.classificacao}, ${this.duracao}, ${this.dataEstreia},`)
    }
}