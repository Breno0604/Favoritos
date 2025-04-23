# Instruções para Executar a Aplicação Favoritos

Este documento contém as instruções necessárias para configurar e executar a aplicação de gerenciamento de favoritos.

## Pré-requisitos

- Node.js versão 18.0.0 ou superior
- NPM versão 8.0.0 ou superior
- Conta no Supabase (gratuita)
- Conexão com a internet (para carregar o Tailwind CSS via CDN)

## Passo 1: Configurar o Supabase

1. Acesse [https://supabase.com](https://supabase.com) e crie uma conta (caso não tenha)
2. Crie um novo projeto no Supabase
3. Após a criação do projeto, vá até a seção "SQL Editor"
4. Execute o script SQL que está no arquivo `supabase.sql` na raiz do projeto

## Passo 2: Configurar as Variáveis de Ambiente

1. Na raiz do projeto, crie um arquivo chamado `.env.local`
2. Adicione as seguintes variáveis no arquivo:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_KEY=sua-chave-anonima-do-supabase
```

Para obter essas informações:

- O valor de `VITE_SUPABASE_URL` é a URL do seu projeto no Supabase (encontrada na seção "Project Settings" > "API")
- O valor de `VITE_SUPABASE_KEY` é a "anon public" key (encontrada também na seção "Project Settings" > "API")

## Passo 3: Instalar Dependências

Execute o seguinte comando no terminal, na raiz do projeto:

```bash
npm install
```

## Passo 4: Executar a Aplicação

Execute o seguinte comando para iniciar a aplicação:

```bash
npm run dev
```

A aplicação estará disponível em [http://localhost:5173](http://localhost:5173)

## Observações Importantes

- A aplicação não possui autenticação, porém as políticas de segurança do Supabase foram configuradas para permitir apenas operações seguras.
- Os favoritos são automaticamente organizados por seções e podem ser reordenados com drag-and-drop.
- Você pode importar/exportar seus favoritos através do botão na barra superior da aplicação.
- A aplicação utiliza Tailwind CSS via CDN, então é necessário estar conectado à internet para visualização correta dos estilos.

## Solução de Problemas

- Se você encontrar o erro "Failed to connect to the Supabase client", verifique se as variáveis de ambiente estão configuradas corretamente no arquivo `.env.local`.
- Se a estilização não estiver aparecendo corretamente, confirme que você está conectado à internet para carregar o Tailwind CSS via CDN.

Para mais informações ou suporte, consulte a documentação do Supabase em [https://supabase.com/docs](https://supabase.com/docs). 