import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useFavoritos } from '@/lib/favoritosContext';
import FormAdicionarFavorito from './FormAdicionarFavorito';
import { TOAST_TYPES } from '@/components/ui/toast';

const ModalConfirmacao = ({ aberto, onFechar, onConfirmar, titulo, mensagem }) => (
  <Dialog open={aberto} onOpenChange={onFechar}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{titulo}</DialogTitle>
        <DialogDescription>
          {mensagem}
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onFechar}>Cancelar</Button>
        <Button variant="destructive" onClick={onConfirmar}>Excluir</Button>
      </div>
    </DialogContent>
  </Dialog>
);

const FavoritoCard = ({ favorito }) => {
  const { excluirFavorito, adicionarToast } = useFavoritos();
  const [modalEditarFavorito, setModalEditarFavorito] = useState(false);
  const [modalConfirmacao, setModalConfirmacao] = useState(false);
  
  // Configuração para drag-and-drop do favorito
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: favorito.id,
    data: {
      type: 'favorito',
      item: favorito
    },
    animateLayoutChanges: () => false,
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };
  
  const confirmarExclusao = (e) => {
    e.stopPropagation();
    setModalConfirmacao(true);
  };
  
  const abrirEditarFavorito = (e) => {
    e.stopPropagation();
    setModalEditarFavorito(true);
  };
  
  const excluir = async () => {
    try {
      await excluirFavorito(favorito.id);
      setModalConfirmacao(false);
    } catch (error) {
      adicionarToast(TOAST_TYPES.ERROR, 'Erro ao excluir favorito');
      console.error('Erro ao excluir favorito:', error);
    }
  };
  
  const abrirLink = () => {
    window.open(favorito.url, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <div 
      ref={setNodeRef} 
      style={{ 
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 1,
        cursor: 'pointer'
      }} 
      className="rounded-md border p-3 flex items-center justify-between gap-2 bg-white hover:shadow-md transition-shadow favorito-card"
      onClick={abrirLink}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        {favorito.favicon && (
          <img 
            src={favorito.favicon} 
            alt="Favicon" 
            className="w-5 h-5 flex-shrink-0" 
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        <span className="truncate font-medium">{favorito.titulo}</span>
      </div>
      
      <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
          onClick={abrirEditarFavorito}
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Editar Favorito</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
          onClick={confirmarExclusao}
        >
          <Trash className="h-4 w-4" />
          <span className="sr-only">Excluir Favorito</span>
        </Button>
      </div>
      
      {/* Modal para editar favorito */}
      <Dialog open={modalEditarFavorito} onOpenChange={setModalEditarFavorito}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Editar Favorito</DialogTitle>
            <DialogDescription>
              Edite as informações do favorito
            </DialogDescription>
          </DialogHeader>
          <FormAdicionarFavorito 
            favorito={favorito} 
            onSuccess={() => setModalEditarFavorito(false)} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Modal de confirmação de exclusão */}
      <ModalConfirmacao
        aberto={modalConfirmacao}
        onFechar={() => setModalConfirmacao(false)}
        onConfirmar={excluir}
        titulo="Confirmar Exclusão"
        mensagem={`Tem certeza que deseja excluir o favorito "${favorito.titulo}"?`}
      />
    </div>
  );
};

export default FavoritoCard; 