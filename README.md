# searchlabs-api
##Telas de login

[Post]: usuárioLogar/

descrição	Usado para logar o usuário, a API vai retornar um token que tem que ser usado para acessar API’s que são liberados somente para usuários
Body	{
“email”:””,
“senha”:””
}

Response header	x-access-token: HJK&*%¨*G785678gjhgJghjfg
Response de sucesso	{
    "context": {
        "sucess": true,
        "message": "Login Efetuado com sucesso!"
    },
    "object": [  ]
}
Response de erros	????

 
[Post]: laboratorioLogar/

descrição	Usado para logar o laboratório, a API vai retornar um token que tem que ser usado para acessar API’s que são liberados somente para laboratórios
Body	{
“email”:””,
“senha”:””
}

Response header	x-access-token: HJK&*%¨*G785678gjhgJghjfg
Response de sucesso	{
    "context": {
        "sucess": true,
        "message": "Login Efetuado com sucesso!"
    },
    "object": [  ]
}
Response de erros	????


 
##Telas de Cadastro - Laboratório
[Post]: laboratorios/

Descrição	End-point usado para criar um novo laboratório, para simplificar a aplicação, nessa fase mesmo, 
- Assim que o laboratório salvar esses primeiros dados eu já vou gerar um token e devolver pra vocês no Response header, 
- Vocês precisam passar esse header nas telas seguintes, como se o laboratório já estivesse logado no sistema.
Request Body	{
       "nome": "Lavoisier",
        "razaoSocial": "lav inc",
        "email": "email@gmail.com",
        "cnpj": "1234564894",
        "logotipo": "base64",
        "fotoLaboratorios": "base64",
        "senha": "teste123",
}

Response header	x-access-token: HJK&*%¨*G785678gjhgJghjfg
Response Body	{
    "context": {
        "sucess": true,
        "message": "Laboratório cadastrado com sucesso!"
    },
  "object": {
       "_id": "5a649d7feaf9b03b64a8f8a8",
       "nome": "Lavoisier",
        "razaoSocial": "lav inc",
        "email": "email@gmail.com",
        "cnpj": "1234564894",
        "logotipo": "base64",
        "fotoLaboratorios": "base64",
        "senha": "teste123",
     }
}
Response de erros	????


 
[Put]: laboratorioContato/:id

Descrição	End-point usado para alterar/salvar dados de contato do laboratório.
Request Header	x-access-token: HJK&*%¨*G785678gjhgJghjfg
Request Body	{
       "logradouro": "Av. Mateo Bei",
        "complemento": "Cj 19",
        "numero": "20",
        "bairro": "Sao Mateus",
        "cidade": "Sao Paulo",
        "estado": "Sao Paulo",
        "telefone1": "12315649821",
        "telefone2": "12315649821"
        “textoInformativo”: “texto.....”
}

Response header	x-access-token: HJK&*%¨*G785678gjhgJghjfg
Response Body	{
    "context": {
        "sucess": true,
        "message": "Dados de contato atualizado com sucesso!"
    },
  "object": {
       "_id": "5a649d7feaf9b03b64a8f8a8",
       "logradouro": "Av. Mateo Bei",
        "complemento": "Cj 19",
        "numero": "20",
        "bairro": "Sao Mateus",
        "cidade": "Sao Paulo",
        "estado": "Sao Paulo",
        "telefone1": "12315649821",
        "telefone2": "12315649821"
        “textoInformativo”: “texto.....”

   }
}
Response de erros	????

 
[Put]: laboratorioExames/:id

descrição	End-point usado para alterar/salvar dados de exame do laboratório.
Request Header	x-access-token: HJK&*%¨*G785678gjhgJghjfg
Request Body	{
     "exames": [
            {
                "id": 1,
                "idTiposExame": "78ghj43g4hj3ghj4bnm",
                "descricao": "Tomografia Computadorizada",
                "valor": "20.8"
            },
            {
                "id": 2,
                "idTiposExame": "78hj3ghj4bnm",
                "descricao": "Raio X",
                "valor": "20.8"
            },
        ]
}
Response header	x-access-token: HJK&*%¨*G785678gjhgJghjfg
Response Body	{
    "context": {
        "sucess": true,
        "message": "Dados de Exame atualizado com sucesso!"
    },
  "object": {
       "_id": "5a649d7feaf9b03b64a8f8a8",
       "exames": [
            {
                "id": 1,
                "idTiposExame": "78ghj43g4hj3ghj4bnm",
                "descricao": "Tomografia Computadorizada",
                "valor": "20.8"
            },
            {
                "id": 2,
                "idTiposExame": "78hj3ghj4bnm",
                "descricao": "Raio X",
                "valor": "20.8"
            },
        ]
   }
}
Response de erros	????


 
[Get]: laboratorios/:id

descrição	End-point usado para recuperar todos os dados do laboratório, que não sejam sensíveis, como senha.
Request Header	
Request Body	 Não existe response body em Get
Response header	
Response Body	{
    "context": {
        "sucess": true,
        "message": ""
    },
  "object: {
            "_id":  "5a649d7feaf9b03b64a8f8a8",
            "nome": "Lavoisier",
            "razaoSocial": "lav inc",
            "email": "email@gmail.com",
            "cnpj": "1234564894",
            "logotipo": "base64",
            "fotoLaboratorios": "base64",
            "logradouro": "Av. Mateo Bei",
            "complemento": "Cj 19",
            "numero": "20",
            "bairro": "Sao Mateus",
            "cidade": "Sao Paulo",
            "estado": "Sao Paulo",
            "telefone1": "12315649821",
            "telefone2": "12315649821",
            "exames": [
                {
                    "id": 1,
                    "idTiposExame": "78ghj43g4hj3ghj4bnm",
                    "descricao": "Tomografia Computadorizada",
                    "valor": "20.8"
                }
            ]
        }
}
Response de erros	????


 
##Tela de Cadastro  - Usuário
[Post]: Usuário/
descrição	End-point usado para recuperar todos os dados do laboratório, que não sejam sensíveis, como senha.
Request Header	
Request Body	 {
        "nome": "everton",
        "email": "egmsantos2@yahoo.com.br",
        "senha": "dsa3432",
 }
Response header	
Response Body	{
    "context": {
        "sucess": true,
        "message": "Usuário cadastrado com sucesso!"
    },
  "object: {
            "_id":  "5a649d7feaf9b03b64a8f8a8",
             "nome": "everton",
             "email": "egmsantos2@yahoo.com.br",
             "senha": "dsa3432",
        }
}
Response de erros	????


 
##Tela de pesquisa

[Get]: laboratorios/
descrição	End-point usado para recuperar todos os dados do laboratório, que não sejam sensíveis, como senha.
queryString	Para melhorar a performance use paginação:
?nome= Lavoisier&numItens=5&pageNum=5

Campos que podem ser usados na query string:
nome:  pesquisa regex (tipo o like do sql), procura por partes do texto e não case sensitive (não ignora carateres especiais)..
razaoSocial: pesquisa regex (tipo o like do sql), procura por partes do texto e não case sensitive (não ignora carateres especiais).e.
logradouro: pesquisa regex (tipo o like do sql), procura por partes do texto e não case sensitive (não ignora carateres especiais).
bairro: pesquisa regex (tipo o like do sql), procura por partes do texto e não case sensitive (não ignora carateres especiais).
cidade: pesquisa regex (tipo o like do sql), procura por partes do texto e não case sensitive (não ignora carateres especiais).
estado: pesquisa regex (tipo o like do sql), procura por partes do texto e não case sensitive (não ignora carateres especiais).
exame: string 
numItens: O numero de itens a serem retornados
pageNum: O numero pagina atual

Request Header	
Request Body	 Não existe response body em Get
Response header	
Response Body	{
    "context": {
        "sucess": true,
        "message": ""
    },
  "object: {
            "_id”: "5a649d7feaf9b03b64a8f8a8",
            "nome": "Lavoisier",
            "razaoSocial": "lav inc",
            "email": "email@gmail.com",
            "cnpj": "1234564894",
            "logotipo": "base64",
            "fotoLaboratorios": "base64",
            "logradouro": "Av. Mateo Bei",
            "complemento": "Cj 19",
            "numero": "20",
            "bairro": "São Mateus",
            "cidade": "São Paulo",
            "estado": "São  Paulo",
            "telefone1": "12315649821",
            "telefone2": "12315649821",
            "exames": [
                {
                    "id": 1,
                    "idTiposExame": "78ghj43g4hj3ghj4bnm",
                    "descricao": "Tomografia Computadorizada",
                    "valor": "20.8"
                }
            ]
        }
}
Response de erros	????

 
[Get]: TiposExame/

descrição	End-point usado para recuperar todos os tipos de exame do sistema
Request Header	
Request Body	 Não existe response body em Get
Response header	
Response Body	{
    "context": {
        "sucess": true,
        "message": "”
    },
  "object:[
      {
            "_id":  "5a649d7feaf9b03b64a8f8a8",
            "nome": "Raio X",
        },
        {
            "_id": "2eaf9b03b64dsa34a8f8a8",
            "nome": "Ressonância Magnética",
        }
    ]
}
Response de erros	????


 
##Tela de Laboratorio
[Get]: laboratorios/:id

descrição	End-point usado para recuperar todos os dados do laboratório, que não sejam sensíveis, como senha.
Request Header	
Request Body	 Não existe response body em Get
Response header	
Response Body	{
    "context": {
        "sucess": true,
        "message": "
    },
  "object: {
            "_id": {
                "$oid": "5a649d7feaf9b03b64a8f8a8"
            },
            "nome": "Lavoisier",
            "razaoSocial": "lav inc",
            "email": "email@gmail.com",
            "cnpj": "1234564894",
            "logotipo": "base64",
            "fotoLaboratorios": "base64",
            "logradouro": "Av. Mateo Bei",
            "complemento": "Cj 19",
            "numero": "20",
            "bairro": "Sao Mateus",
            "cidade": "Sao Paulo",
            "estado": "Sao Paulo",
            "telefone1": "12315649821",
            "telefone2": "12315649821",
            "exames": [
                {
                    "id": 1,
                    "idTiposExame": "78ghj43g4hj3ghj4bnm",
                    "descricao": "Tomografia Computadorizada",
                    "valor": "20.8"
                }
            ]
        }
}
Response de erros	????

 
[Post]: favoritosUsuario/:id

descrição	End-point usado para recuperar todos os dados do laboratório, que não sejam sensíveis, como senha.
Request Header	
Request Body	        {
            "idLaboratorio": "",
            "nome": "Lavoisier",
        }
Response header	
Response Body	{
    "context": {
        "sucess": true,
        "message": "Laboratório favoritado com sucesso!"
    },
  "object: {
            "_id": {
                "$oid": "5a649d7feaf9b03b64a8f8a8"
            },
"favoritos": [
            {
                "idLaboratorio": "",
                "nome": "Lavoisier",
            }
]
        }
}
Response de erros	????


 
##Tela Perfil Cliente
[Get]: Usuário/

descrição	End-point usado para recuperar todos os dados do laboratório, que não sejam sensíveis, como senha.
Request Header	
Request Body	Não existe body para Get
Response header	
Response Body	{
    "context": {
        "sucess": true,
        "message": "
    },
  "object: {
        “_id”: “dfe344ggg”,
        "nome": "everton",
        "email": "egmsantos2@yahoo.com.br",
"favoritos": [
            {
                "idLaboratorio": "",
                "nome": "Lavoisier",
            }
]
        }
}
Response de erros	????

 
Extras

[Post]: TiposExame/
descrição	End-point usado para cadastrar novos tipos de exame no sistema
Request Header	
Request Body	 {
            "nome": "Raio X",
  }
Response header	
Response Body	{
    "context": {
        "sucess": true,
        "message": "Dados de contato atualizado com sucesso!"
    },
  "object:  {
            "_id":  "5a649d7feaf9b03b64a8f8a8",
            "nome": "Raio X",
       }
}
Response de erros	{
    "context": {
        "sucess": false,
        "message": "Tipo de Exame já existente!"
    },
  "object:  {  }
}


 
[Put]: TiposExame/:id

descrição	End-point usado para alterar o nome de um tipo de exame especifico
Request Header	
Request Body	 {
            "nome": "Raio X",
  }
Response header	
Response Body	{
    "context": {
        "sucess": true,
        "message": "Dados de contato atualizado com sucesso!"
    },
  "object:  {
            "_id":  "5a649d7feaf9b03b64a8f8a8",
            "nome": "Raio X",
       }
}
Response de erros	???


 

