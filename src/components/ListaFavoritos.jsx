import React, { useCallback, useState } from 'react';
import { 
  DndContext, 
  PointerSensor, 
  closestCenter,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable';
import { useFavoritos } from '@/lib/favoritosContext';
import Secao from './Secao';
import { TOAST_TYPES } from '@/components/ui/toast';

const ListaFavoritos = () => {
  const { 
    secoes, 
    getFavoritosPorSecao, 
    atualizarOrdemSecoes, 
    atualizarOrdemFavoritos,
    adicionarToast,
    termoPesquisa,
    favoritos: todosOsFavoritos
  } = useFavoritos();
  
  const [secaoAtiva, setSecaoAtiva] = useState(null);
  const [favoritoAtivo, setFavoritoAtivo] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);

  // Configurando os sensores para o drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    })
  );

  // Manipuladores para o drag-and-drop
  const handleDragStart = (event) => {
    const { active } = event;
    const { id, data } = active;
    
    if (data.current.type === 'secao') {
      setSecaoAtiva(id);
      // Adicionar classe de feedback visual ao elemento arrastado
      document.body.classList.add('dragging-section');
    } else {
      setFavoritoAtivo(id);
      // Adicionar classe de feedback visual ao elemento arrastado
      document.body.classList.add('dragging-favorite');
    }
  };

  const handleDragOver = (event) => {
    const { over } = event;
    setDropTarget(over ? over.id : null);
  };

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    
    // Remover classes de feedback visual
    document.body.classList.remove('dragging-section', 'dragging-favorite');
    setDropTarget(null);
    
    if (!over) {
      setSecaoAtiva(null);
      setFavoritoAtivo(null);
      return;
    }
    
    // Se estamos arrastando uma seção
    if (secaoAtiva) {
      // Se a ordem mudou
      if (active.id !== over.id) {
        const activeIndex = secoes.findIndex((secao) => secao.id === active.id);
        const overIndex = secoes.findIndex((secao) => secao.id === over.id);
        
        if (activeIndex !== -1 && overIndex !== -1) {
          const novaOrdemSecoes = arrayMove(secoes, activeIndex, overIndex);
          
          try {
            atualizarOrdemSecoes(novaOrdemSecoes);
          } catch (error) {
            adicionarToast(TOAST_TYPES.ERROR, 'Erro ao reordenar seções');
            console.error('Erro ao reordenar seções:', error);
          }
        }
      }
      
      setSecaoAtiva(null);
    }
    
    // Se estamos arrastando um favorito
    if (favoritoAtivo) {
      const favoritoArrastado = todosOsFavoritos.find(f => f.id === active.id);
      const favoritoDestino = todosOsFavoritos.find(f => f.id === over.id);
      
      if (favoritoArrastado && favoritoDestino) {
        // Verificar se o favorito está sendo movido para outra seção
        const mesmaSecao = favoritoArrastado.secao_id === favoritoDestino.secao_id;
        
        if (mesmaSecao) {
          // Reordenar na mesma seção
          const favoritosSecao = getFavoritosPorSecao(favoritoArrastado.secao_id);
          
          const activeIndex = favoritosSecao.findIndex((f) => f.id === active.id);
          const overIndex = favoritosSecao.findIndex((f) => f.id === over.id);
          
          if (activeIndex !== -1 && overIndex !== -1) {
            const novaOrdemFavoritos = arrayMove(favoritosSecao, activeIndex, overIndex);
            
            try {
              atualizarOrdemFavoritos(novaOrdemFavoritos);
            } catch (error) {
              adicionarToast(TOAST_TYPES.ERROR, 'Erro ao reordenar favoritos');
              console.error('Erro ao reordenar favoritos:', error);
            }
          }
        } else {
          // Mover para outra seção
          // Criar nova lista de favoritos com o item movido
          const todosOsFavoritosAtualizado = todosOsFavoritos.map(f => {
            if (f.id === favoritoArrastado.id) {
              return { ...f, secao_id: favoritoDestino.secao_id };
            }
            return f;
          });
          
          try {
            // Reordenar favoritos considerando a nova seção
            const favoritosSecaoOrigem = getFavoritosPorSecao(favoritoArrastado.secao_id)
              .filter(f => f.id !== favoritoArrastado.id);
            
            const favoritosSecaoDestino = [
              ...getFavoritosPorSecao(favoritoDestino.secao_id).filter(f => f.id !== favoritoArrastado.id)
            ];
            
            // Inserir o favorito na nova posição
            const posicaoDestino = favoritosSecaoDestino.findIndex(f => f.id === favoritoDestino.id);
            favoritosSecaoDestino.splice(posicaoDestino >= 0 ? posicaoDestino : 0, 0, {
              ...favoritoArrastado,
              secao_id: favoritoDestino.secao_id
            });
            
            // Atualizar a ordem de todos os favoritos
            atualizarOrdemFavoritos([...favoritosSecaoOrigem, ...favoritosSecaoDestino]);
          } catch (error) {
            adicionarToast(TOAST_TYPES.ERROR, 'Erro ao mover favorito para outra seção');
            console.error('Erro ao mover favorito:', error);
          }
        }
      }
      
      setFavoritoAtivo(null);
    }
  }, [secaoAtiva, favoritoAtivo, secoes, todosOsFavoritos, getFavoritosPorSecao, atualizarOrdemSecoes, atualizarOrdemFavoritos, adicionarToast]);

  // Se houver um termo de pesquisa, mostramos os favoritos filtrados
  if (termoPesquisa) {
    const favoritosFiltrados = todosOsFavoritos.filter(
      f => f.titulo.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
           f.url.toLowerCase().includes(termoPesquisa.toLowerCase())
    );
    
    if (favoritosFiltrados.length === 0) {
      return (
        <div className="p-8 text-center text-gray-500">
          Nenhum favorito encontrado para "{termoPesquisa}".
        </div>
      );
    }
    
    // Agrupar por seção para exibição
    const secoesComFavoritos = secoes.filter(secao => 
      favoritosFiltrados.some(f => f.secao_id === secao.id)
    );
    
    return (
      <div className="container mx-auto p-4">
        {secoesComFavoritos.map(secao => (
          <div key={secao.id} className="mb-4">
            <div 
              className="p-3 mb-2 rounded"
              style={{ 
                backgroundColor: secao.cor_fundo || '#f3f4f6', 
                color: secao.cor_texto || '#111827' 
              }}
            >
              <h2 className="font-medium">{secao.titulo}</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {favoritosFiltrados
                .filter(f => f.secao_id === secao.id)
                .map(favorito => (
                  <div 
                    key={favorito.id}
                    className="border p-3 rounded-md flex items-center gap-2 bg-white cursor-pointer hover:shadow-md"
                    onClick={() => window.open(favorito.url, '_blank', 'noopener,noreferrer')}
                  >
                    {favorito.favicon && (
                      <img 
                        src={favorito.favicon} 
                        alt="Favicon" 
                        className="w-5 h-5" 
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <span className="truncate font-medium">{favorito.titulo}</span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Exibição normal das seções e favoritos com drag-and-drop
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="container mx-auto p-4">
        <SortableContext
          items={secoes.map(secao => secao.id)}
          strategy={verticalListSortingStrategy}
        >
          {secoes.map(secao => (
            <Secao
              key={secao.id}
              secao={secao}
              favoritosSecao={getFavoritosPorSecao(secao.id)}
              isDropTarget={dropTarget === secao.id}
            />
          ))}
        </SortableContext>
        
        {secoes.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Nenhuma seção encontrada. Clique no botão "+" para adicionar uma seção.
          </div>
        )}
      </div>
    </DndContext>
  );
};

export default ListaFavoritos; 