import React, { useState } from 'react';
import { Plus, Search, X, FilePlus, FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useFavoritos } from '@/lib/favoritosContext';
import FormAdicionarSecao from './FormAdicionarSecao';
import FormAdicionarFavorito from './FormAdicionarFavorito';
import ImportExportModal from './ImportExportModal';

const Header = () => {
  const { termoPesquisa, setTermoPesquisa } = useFavoritos();
  const [modalAdicionarSecao, setModalAdicionarSecao] = useState(false);
  const [modalAdicionarFavorito, setModalAdicionarFavorito] = useState(false);
  const [modalImportExport, setModalImportExport] = useState(false);

  const limparPesquisa = () => {
    setTermoPesquisa('');
  };

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Favoritos</h1>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Pesquisar favoritos..."
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
              className="w-48 pr-8"
            />
            {termoPesquisa && (
              <button 
                onClick={limparPesquisa}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-4 w-4 text-gray-500" />
                <span className="sr-only">Limpar</span>
              </button>
            )}
            {!termoPesquisa && (
              <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            )}
          </div>
          
          <Button 
            size="icon" 
            variant="outline" 
            onClick={() => setModalImportExport(true)}
            title="Importar/Exportar"
            className="text-primary hover:text-primary hover:bg-primary/10"
          >
            <FilePlus className="h-5 w-5" />
            <span className="sr-only">Importar/Exportar</span>
          </Button>

          <Button 
            size="icon" 
            variant="outline" 
            onClick={() => setModalAdicionarFavorito(true)}
            title="Adicionar Favorito"
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <Plus className="h-5 w-5" />
            <span className="sr-only">Adicionar Favorito</span>
          </Button>
          
          <Button 
            size="icon" 
            variant="outline" 
            onClick={() => setModalAdicionarSecao(true)}
            title="Adicionar Seção"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <FolderPlus className="h-5 w-5" />
            <span className="sr-only">Adicionar Seção</span>
          </Button>
        </div>

        {/* Modal para adicionar seção */}
        <Dialog open={modalAdicionarSecao} onOpenChange={setModalAdicionarSecao}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Seção</DialogTitle>
              <DialogDescription>
                Crie uma nova seção para organizar seus favoritos
              </DialogDescription>
            </DialogHeader>
            <FormAdicionarSecao onSuccess={() => setModalAdicionarSecao(false)} />
          </DialogContent>
        </Dialog>

        {/* Modal para adicionar favorito */}
        <Dialog open={modalAdicionarFavorito} onOpenChange={setModalAdicionarFavorito}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Favorito</DialogTitle>
              <DialogDescription>
                Adicione um novo site aos seus favoritos
              </DialogDescription>
            </DialogHeader>
            <FormAdicionarFavorito onSuccess={() => setModalAdicionarFavorito(false)} />
          </DialogContent>
        </Dialog>

        {/* Modal de importação/exportação */}
        <Dialog open={modalImportExport} onOpenChange={setModalImportExport}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Importar/Exportar</DialogTitle>
              <DialogDescription>
                Importe ou exporte seus favoritos
              </DialogDescription>
            </DialogHeader>
            <ImportExportModal onClose={() => setModalImportExport(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};

export default Header; 