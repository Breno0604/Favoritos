# Favoritos - Gerenciador de Favoritos Web

Um aplicativo web moderno para gerenciar seus favoritos da web de forma organizada, com recursos de arrastar e soltar, pesquisa e personalização.

## Funcionalidades

- Organização de favoritos em seções customizáveis
- Personalização de cores para cada seção
- Funcionalidade de arrastar e soltar para reorganizar itens
- Extração automática de favicons
- Pesquisa em tempo real
- Importação e exportação para backup
- Armazenamento na nuvem usando Supabase

## Tecnologias Utilizadas

- **Frontend**: React 19, Vite
- **UI Components**: Shadcn UI
- **Gerenciamento de Estado**: React Context API
- **Back-end**: Supabase
- **Drag-and-Drop**: dnd-kit
- **Estilização**: Tailwind CSS
- **Exportação/Importação**: SheetJS
- **Outras**: clsx, tailwind-merge, lucide-react

## Instalação e Uso

Para instruções detalhadas sobre como configurar e executar o aplicativo, consulte o [arquivo de instruções](instrucoes.md).

## Estrutura do Projeto

```
src/
  ├── components/       # Componentes da UI
  │   ├── ui/           # Componentes base do Shadcn
  │   └── ...           # Componentes específicos da aplicação
  ├── lib/              # Funções e hooks utilitários
  │   ├── supabase.js   # Cliente e funções do Supabase
  │   └── ...           # Outros utilitários
  ├── App.jsx           # Componente principal
  └── main.jsx          # Ponto de entrada
```

## Licença

Este projeto é licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.
