// Função para gerar os dias
function gerarDias() {
    let mes = parseInt(document.getElementById("mes").value, 10); // Certifique-se de que o valor é um número
    let ano = parseInt(document.getElementById("ano").value, 10); // Certifique-se de que o valor é um número

    if (isNaN(mes) || isNaN(ano)) {
        // Verifique se o mês e ano são válidos
        console.error("Mês ou ano inválido.");
        return;
    }

    let diasNoMes = new Date(ano, mes, 0).getDate();

    let diasJustificado = document.getElementById("diasJustificado");
    let diasFeriado = document.getElementById("diasFeriado");

    diasJustificado.innerHTML = "";
    diasFeriado.innerHTML = "";

    for (let dia = 1; dia <= diasNoMes; dia++) {
        let checkboxJustificado = document.createElement("input");
        checkboxJustificado.type = "checkbox";
        checkboxJustificado.id = `justificado${dia}`;
        checkboxJustificado.value = dia;
        
        let labelJustificado = document.createElement("label");
        labelJustificado.className = "day-box";
        labelJustificado.appendChild(checkboxJustificado);
        labelJustificado.appendChild(document.createTextNode(dia));
        
        let checkboxFeriado = document.createElement("input");
        checkboxFeriado.type = "checkbox";
        checkboxFeriado.id = `feriado${dia}`;
        checkboxFeriado.value = dia;

        let labelFeriado = document.createElement("label");
        labelFeriado.className = "day-box";
        labelFeriado.appendChild(checkboxFeriado);
        labelFeriado.appendChild(document.createTextNode(dia));

        diasJustificado.appendChild(labelJustificado);
        diasFeriado.appendChild(labelFeriado);
    }
}

// Adicionar event listeners para chamar a função quando o valor mudar
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("mes").addEventListener("change", gerarDias);
    document.getElementById("ano").addEventListener("change", gerarDias);
});
