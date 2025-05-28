// variaveis da operação aritmetica
let valor1 = document.getElementById('num1');
let valor2 = document.getElementById('num2');
let opAritmetico = document.getElementById('opAritmetico');
let resultado = document.getElementById('resultado');

// variaveis da operação logica
let opLogico1 = document.getElementById("op1")
let opLogico2 = document.getElementById("op2")
let opLogico = document.getElementById("opLogico")
let resultadoLogico = document.getElementById("resultadoLog")

// função para os calculos aritméticos
function calculoAritmetico(operador, valor1, valor2) {
    switch (operador) {
        case '+':
            return valor1 + valor2;
        case '-':
            return valor1 - valor2;
        case '*':
            return valor1 * valor2;
        case '/':
            return valor1 / valor2;
        default:
            return 'Operação inválida';
    }
}

valor1.addEventListener('input', function () {
    resultado.innerHTML = calculoAritmetico(opAritmetico.value, Number(valor1.value), Number(valor2.value));
});
valor2.addEventListener('input', function () {
    resultado.innerHTML = calculoAritmetico(opAritmetico.value, Number(valor1.value), Number(valor2.value));
});
opAritmetico.addEventListener('input', function () {
    resultado.innerHTML = calculoAritmetico(opAritmetico.value, Number(valor1.value), Number(valor2.value));
});

// função para os calculos lógicos
function calculoLogico(operador, valor1, valor2) {
    switch (operador) {
        case '&':
            return valor1 & valor2;
        case '|':
            return valor1 | valor2;
        default:
            return 'Operação inválida';
    }
}

opLogico1.addEventListener('input', function () {
    resultado = calculoLogico(opLogico.value, opLogico1.value, opLogico2.value);
    resultadoLogico.textContent = resultado;
});
opLogico2.addEventListener('input', function () {
    resultado = calculoLogico(opLogico.value, opLogico1.value, opLogico2.value);
    resultadoLogico.textContent = resultado;
});
opLogico.addEventListener('click', function () {
    resultado = calculoLogico(opLogico.value, opLogico1.value, opLogico2.value);
    resultadoLogico.textContent = resultado;
});
// variáveis para a calculadora binária
let numBin1 = document.getElementById('numBin1');
let numBin2 = document.getElementById('numBin2');
let resultadoBin = document.getElementById('resultadoBin');

// função para somar números binários
function somaBinaria(bin1, bin2) {
    let decimal1 = parseInt(bin1, 2);
    let decimal2 = parseInt(bin2, 2);

    if (isNaN(decimal1) || isNaN(decimal2)) {
        return 'Entrada inválida';
    }

    let somaDecimal = decimal1 + decimal2;
    return somaDecimal.toString(2); // converte o resultado de volta para binário
}

numBin1.addEventListener('input', function () {
    resultadoBin.textContent = somaBinaria(numBin1.value, numBin2.value);
});
numBin2.addEventListener('input', function () {
    resultadoBin.textContent = somaBinaria(numBin1.value, numBin2.value);
});