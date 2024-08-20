import sys
import pandas as pd
from datetime import datetime, timedelta

def gerar_folha(nome, mes, ano, feriados, justificado):
    # Cria uma lista para armazenar os dados da tabela
    dados = []

    # Obtém o número de dias no mês
    dias_no_mes = (datetime(ano, mes % 12 + 1, 1) - timedelta(days=1)).day

    for dia in range(1, dias_no_mes + 1):
        data = datetime(ano, mes, dia)
        dia_semana = data.weekday()  # 0 = segunda, 6 = domingo

        # Verifica se é sábado, domingo ou feriado
        if dia_semana == 5:  # Sábado
            status = "SÁBADO"
            entrada = saida = visto = "------"
        elif dia_semana == 6:  # Domingo
            status = "DOMINGO"
            entrada = saida = visto = "------"
        elif dia in feriados:  # Feriado
            status = "FERIADO"
            entrada = saida = visto = "------"
        elif dia in justificado: #Justificado
            status = 'JUSTIFICADO'
            entrada = saida = visto = "------"     
        else:
            status = ""
            entrada = saida = visto = ""

        # Adiciona os dados à lista
        dados.append([dia, status, entrada, saida, visto])

    # Cria um DataFrame a partir dos dados
    colunas = ["Dia", "Assinatura", "Entrada", "Saída", "Visto Responsável"]
    df = pd.DataFrame(dados, columns=colunas)

    # Salva o arquivo
    output_path = f"output_{nome.replace(' ', '_')}_{ano}_{mes}.xlsx"
    df.to_excel(output_path, index=False)
    print(output_path)  # Adiciona um print para depuração

    return output_path

# Recebe os argumentos da linha de comando
nome = sys.argv[1]
mes = int(sys.argv[2])
ano = int(sys.argv[3])
feriados = list(map(int, sys.argv[4].strip('[]').split(',')))
justificado = list(map(int, sys.argv[5].strip('[]').split(',')))

# Chama a função e imprime o caminho do arquivo gerado
output_path = gerar_folha(nome, mes, ano, feriados, justificado)
print(output_path)
