const express = require('express');
const path = require('path');
const multer = require('multer');
const XLSX = require('xlsx');
const { spawn } = require('child_process');

const app = express();
const port = 3000;

// Configurando o Multer para upload de arquivos (se necessário)
const upload = multer({ dest: 'uploads/' });

// Servindo arquivos estáticos na pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para processar JSON no corpo da requisição
app.use(express.json());

// Rota para obter os nomes dos voluntários do Excel
app.get('/voluntarios', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', 'dados_voluntarios.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const voluntarios = sheet.map(row => row.NOME); // Supondo que o nome dos voluntários esteja em uma coluna 'Nome'
    
    res.json(voluntarios);
});

// Rota para processar os dados enviados pelo formulário
app.post('/processar', (req, res) => {
    const { voluntarios, ano, mes, justificados, feriados } = req.body;

    // Aqui você pode processar os dados como precisar
    console.log('Voluntários:', voluntarios);
    console.log('Ano:', ano);
    console.log('Mês:', mes);
    console.log('Dias Justificados:', justificados);
    console.log('Dias Feriados:', feriados);

    // Enviar uma resposta de sucesso
    res.json({ status: 'success', message: 'Dados recebidos com sucesso!' });
});

// Rota para gerar folha
app.post('/gerar-folha', (req, res) => {
    const nome = req.body.nome;
    const mes = req.body.mes;
    const ano = req.body.ano;
    const feriados = req.body.feriados || [];
    const justificado = req.body.justificado || [];

    // Converte arrays para strings JSON
    const feriadosStr = JSON.stringify(feriados);
    const justificadoStr = JSON.stringify(justificado);

    // Executa o script Python
    const pythonProcess = spawn('python', ['preencher_html.py', nome, mes, ano, feriadosStr, justificadoStr]);

    pythonProcess.stdout.on('data', (data) => {
        const outputPath = data.toString().trim();
        const filePath = path.join(__dirname, outputPath);

        // Verifica se o arquivo existe
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.error(`Arquivo não encontrado: ${filePath}`);
                res.status(404).json({ status: 'error', message: 'Arquivo não encontrado' });
                return;
            }

            res.sendFile(filePath, (err) => {
                if (err) {
                    console.error('Erro ao enviar o arquivo:', err);
                    res.status(500).send('Erro ao enviar o arquivo');
                } else {
                    console.log('Arquivo enviado com sucesso!');
                }
            });
        });
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Process exited with code ${code}`);
            res.status(500).json({ status: 'error', message: 'Erro ao gerar a folha' });
        }
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
