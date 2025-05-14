export class Venda{
    constructor(id, sessao, nomeCliente, cpf, assento, tipoPagamento){
        this.id = id;
        this.sessao = sessao;
        this.nomeCliente = nomeCliente;
        this.cpf = cpf;
        this.assento = assento;
        this.tipoPagamento = tipoPagamento;
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //GET E SET
    getId(){
        return this.id;
    }
    setId(id){
        this.id = id;
    }
    getSessao(){
        return this.sessao;
    }
    setSessao(sessao){
        this.sessao = sessao;
    }
    getCliente(){
        return this.nomeCliente;
    }
    setCliente(nomeCliente){
        this.nomeCliente = nomeCliente;
    }
    getCpf(){
        return this.cpf;
    }
    setCpf(cpf){
        this.cpf = cpf;
    }
    getAssento(){
        return this.assento;
    }
    setAssento(assento){
        this.assento = assento;
    }
    getTipoPagamento(){
        return this.tipoPagamento;
    }
    setTipoPagamento(tipoPagamento){
        this.tipoPagamento = tipoPagamento;
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // toString
    toString(){
        return console.log(`{ ${this.id}, ${this.cliente}, ${this.sessao}, ${this.lugar}, ${this.valor},`)
    }
}