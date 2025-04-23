import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronRight, Plus, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useFavoritos } from '@/lib/favoritosContext';
import FormAdicionarFavorito from './FormAdicionarFavorito';
import FormAdicionarSecao from './FormAdicionarSecao';
import FavoritoCard from './FavoritoCard';
import { TOAST_TYPES } from '@/components/ui/toast';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

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

const Secao = ({ secao, favoritosSecao, isDropTarget }) => {
  const { alternarSecao, secoesFechadas, excluirSecao, adicionarToast } = useFavoritos();
  const [modalEditarSecao, setModalEditarSecao] = useState(false);
  const [modalAdicionarFavorito, setModalAdicionarFavorito] = useState(false);
  const [modalConfirmacao, setModalConfirmacao] = useState(false);
  
  const fechada = secoesFechadas[secao.id];
  
  // Configuração para drag-and-drop da seção
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: secao.id,
    data: {
      type: 'secao',
      item: secao
    },
    animateLayoutChanges: () => false,
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };
  
  const confirmarExclusao = () => {
    setModalConfirmacao(true);
  };
  
  const excluir = async () => {
    try {
      await excluirSecao(secao.id);
      setModalConfirmacao(false);
    } catch (error) {
      adicionarToast(TOAST_TYPES.ERROR, 'Erro ao excluir seção');
      console.error('Erro ao excluir seção:', error);
    }
  };
  
  return (
    <div 
      style={{ opacity: isDragging ? 0.5 : 1, zIndex: isDragging ? 10 : 1 }}
      className={`mb-4 rounded-md overflow-hidden bg-white shadow-sm secao-container ${isDropTarget ? 'drop-target' : ''}`}
    >
      {/* Cabeçalho da seção */}
      <div 
        ref={setNodeRef}
        className="flex items-center justify-between p-3 cursor-pointer"
        style={{ 
          backgroundColor: secao.cor_fundo || '#f3f4f6', 
          color: secao.cor_texto || '#111827',
          transform: CSS.Transform.toString(transform),
          transition
        }}
        {...attributes}
        {...listeners}
      >
        <div 
          className="flex items-center flex-1"
          onClick={(e) => {
            e.stopPropagation();
            alternarSecao(secao.id);
          }}
        >
          {fechada ? (
            <ChevronRight className="h-5 w-5 mr-2" />
          ) : (
            <ChevronDown className="h-5 w-5 mr-2" />
          )}
          <span className="font-medium">
            {secao.titulo}
          </span>
        </div>
        
        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          <Plus 
            className="h-5 w-5 cursor-pointer hover:scale-110 transition-transform" 
            onClick={() => setModalAdicionarFavorito(true)}
            style={{ color: secao.cor_texto || '#111827' }}
            title="Adicionar Favorito"
          />
          
          <Edit 
            className="h-5 w-5 cursor-pointer hover:scale-110 transition-transform" 
            onClick={() => setModalEditarSecao(true)}
            style={{ color: secao.cor_texto || '#111827' }}
            title="Editar Seção"
          />
          
          <Trash 
            className="h-5 w-5 cursor-pointer hover:scale-110 transition-transform" 
            onClick={confirmarExclusao}
            style={{ color: secao.cor_texto || '#111827' }}
            title="Excluir Seção"
          />
        </div>
      </div>
      
      {/* Conteúdo da seção (favoritos) */}
      <div 
        className={`secao-conteudo ${fechada ? 'recolhido' : 'expandido'}`}
      >
        <SortableContext
          items={favoritosSecao.map(favorito => favorito.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {favoritosSecao.map(favorito => (
              <FavoritoCard key={favorito.id} favorito={favorito} />
            ))}
            
            {favoritosSecao.length === 0 && (
              <div className="col-span-full p-4 text-center text-gray-500">
                Nenhum favorito nesta seção.
              </div>
            )}
          </div>
        </SortableContext>
      </div>
      
      {/* Modal para editar seção */}
      <Dialog open={modalEditarSecao} onOpenChange={setModalEditarSecao}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Seção</DialogTitle>
            <DialogDescription>
              Edite as informações da seção
            </DialogDescription>
          </DialogHeader>
          <FormAdicionarSecao 
            secao={secao} 
            onSuccess={() => setModalEditarSecao(false)} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Modal para adicionar favorito */}
      <Dialog open={modalAdicionarFavorito} onOpenChange={setModalAdicionarFavorito}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Favorito</DialogTitle>
            <DialogDescription>
              Adicione um novo favorito à seção
            </DialogDescription>
          </DialogHeader>
          <FormAdicionarFavorito 
            secaoId={secao.id}
            onSuccess={() => setModalAdicionarFavorito(false)} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Modal de confirmação de exclusão */}
      <ModalConfirmacao
        aberto={modalConfirmacao}
        onFechar={() => setModalConfirmacao(false)}
        onConfirmar={excluir}
        titulo="Confirmar Exclusão"
        mensagem={`Tem certeza que deseja excluir a seção "${secao.titulo}" e todos os seus favoritos?`}
      />
    </div>
  );
};

export default Secao; 