import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as supabaseService from './supabase';
import { TOAST_TYPES } from '@/components/ui/toast';

// Contexto para os favoritos
const FavoritosContext = createContext(null);

// Hook personalizado para usar o contexto
export const useFavoritos = () => {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error('useFavoritos deve ser usado dentro de um FavoritosProvider');
  }
  return context;
};

// Provider do contexto
export const FavoritosProvider = ({ children }) => {
  const [secoes, setSecoes] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [secoesFechadas, setSecoesFechadas] = useState({});
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [toasts, setToasts] = useState([]);

  // Adicionar uma notificação
  const adicionarToast = useCallback((tipo, mensagem) => {
    // Verificando se já existe um toast semelhante
    const existeToastSemelhante = toasts.some(toast => toast.message === mensagem);
    
    if (existeToastSemelhante) return;
    
    // Evitar mostrar mensagem de "Dados carregados com sucesso" repetidamente
    if (mensagem === 'Dados carregados com sucesso' && tipo === TOAST_TYPES.SUCCESS) {
      // Verificar se não é a primeira vez que carrega os dados
      if (secoes.length > 0 || favoritos.length > 0) {
        return;
      }
    }
    
    const novoToast = {
      id: uuidv4(),
      type: tipo,
      message: mensagem
    };
    
    setToasts(toasts => [...toasts, novoToast]);
  }, [toasts, secoes.length, favoritos.length]);

  // Remover uma notificação
  const removerToast = useCallback((id) => {
    setToasts(toasts => toasts.filter(toast => toast.id !== id));
  }, []);

  // Carregar dados iniciais
  const carregarDados = useCallback(async () => {
    setCarregando(true);
    try {
      // Carregar seções
      const secoesData = await supabaseService.getSecoes();
      setSecoes(secoesData);
      
      // Carregar favoritos
      const favoritosData = await supabaseService.getFavoritos();
      setFavoritos(favoritosData);
      
      adicionarToast(TOAST_TYPES.SUCCESS, 'Dados carregados com sucesso');
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      adicionarToast(TOAST_TYPES.ERROR, 'Erro ao carregar dados');
    } finally {
      setCarregando(false);
    }
  }, [adicionarToast]);

  // Efeito para carregar dados na inicialização
  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Adicionar seção
  const adicionarSecao = async (novaSecao) => {
    try {
      const secao = await supabaseService.adicionarSecao({
        ...novaSecao,
        ordem: secoes.length
      });
      
      setSecoes(secoesAtuais => [...secoesAtuais, secao]);
      adicionarToast(TOAST_TYPES.SUCCESS, 'Seção adicionada com sucesso');
      return secao;
    } catch (error) {
      adicionarToast(TOAST_TYPES.ERROR, 'Erro ao adicionar seção');
      throw error;
    }
  };

  // Atualizar seção
  const atualizarSecao = async (id, dadosAtualizados) => {
    try {
      const secaoAtualizada = await supabaseService.atualizarSecao(id, dadosAtualizados);
      
      setSecoes(secoesAtuais => 
        secoesAtuais.map(secao => 
          secao.id === id ? { ...secao, ...secaoAtualizada } : secao
        )
      );
      
      adicionarToast(TOAST_TYPES.SUCCESS, 'Seção atualizada com sucesso');
      return secaoAtualizada;
    } catch (error) {
      adicionarToast(TOAST_TYPES.ERROR, 'Erro ao atualizar seção');
      throw error;
    }
  };

  // Excluir seção
  const excluirSecao = async (id) => {
    try {
      await supabaseService.excluirSecao(id);
      
      // Remover seção da lista
      setSecoes(secoesAtuais => secoesAtuais.filter(secao => secao.id !== id));
      
      // Remover favoritos associados à seção
      setFavoritos(favoritosAtuais => favoritosAtuais.filter(favorito => favorito.secao_id !== id));
      
      adicionarToast(TOAST_TYPES.SUCCESS, 'Seção excluída com sucesso');
      return true;
    } catch (error) {
      adicionarToast(TOAST_TYPES.ERROR, 'Erro ao excluir seção');
      throw error;
    }
  };

  // Adicionar favorito
  const adicionarFavorito = async (novoFavorito) => {
    try {
      // Calcular ordem baseada nos favoritos da mesma seção
      const favoritosSecao = favoritos.filter(f => f.secao_id === novoFavorito.secao_id);
      const ordem = favoritosSecao.length;
      
      const favorito = await supabaseService.adicionarFavorito({
        ...novoFavorito,
        ordem
      });
      
      setFavoritos(favoritosAtuais => [...favoritosAtuais, favorito]);
      adicionarToast(TOAST_TYPES.SUCCESS, 'Favorito adicionado com sucesso');
      return favorito;
    } catch (error) {
      adicionarToast(TOAST_TYPES.ERROR, 'Erro ao adicionar favorito');
      throw error;
    }
  };

  // Atualizar favorito
  const atualizarFavorito = async (id, dadosAtualizados) => {
    try {
      const favoritoAtualizado = await supabaseService.atualizarFavorito(id, dadosAtualizados);
      
      setFavoritos(favoritosAtuais => 
        favoritosAtuais.map(favorito => 
          favorito.id === id ? { ...favorito, ...favoritoAtualizado } : favorito
        )
      );
      
      adicionarToast(TOAST_TYPES.SUCCESS, 'Favorito atualizado com sucesso');
      return favoritoAtualizado;
    } catch (error) {
      adicionarToast(TOAST_TYPES.ERROR, 'Erro ao atualizar favorito');
      throw error;
    }
  };

  // Excluir favorito
  const excluirFavorito = async (id) => {
    try {
      await supabaseService.excluirFavorito(id);
      
      setFavoritos(favoritosAtuais => favoritosAtuais.filter(favorito => favorito.id !== id));
      adicionarToast(TOAST_TYPES.SUCCESS, 'Favorito excluído com sucesso');
      return true;
    } catch (error) {
      adicionarToast(TOAST_TYPES.ERROR, 'Erro ao excluir favorito');
      throw error;
    }
  };

  // Atualizar ordem das seções
  const atualizarOrdemSecoes = async (novaOrdemSecoes) => {
    try {
      setSecoes(novaOrdemSecoes);
      await supabaseService.atualizarOrdemSecoes(novaOrdemSecoes);
      return true;
    } catch (error) {
      adicionarToast(TOAST_TYPES.ERROR, 'Erro ao atualizar ordem das seções');
      throw error;
    }
  };

  // Atualizar ordem dos favoritos
  const atualizarOrdemFavoritos = async (novaOrdemFavoritos) => {
    try {
      setFavoritos(novaOrdemFavoritos);
      await supabaseService.atualizarOrdemFavoritos(novaOrdemFavoritos);
      return true;
    } catch (error) {
      adicionarToast(TOAST_TYPES.ERROR, 'Erro ao atualizar ordem dos favoritos');
      throw error;
    }
  };

  // Alternar estado de abertura/fechamento de uma seção
  const alternarSecao = (id) => {
    setSecoesFechadas(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  // Obter favoritos de uma seção específica
  const getFavoritosPorSecao = (secaoId) => {
    return favoritos.filter(favorito => favorito.secao_id === secaoId)
                    .sort((a, b) => a.ordem - b.ordem);
  };

  // Filtrar favoritos por termo de pesquisa
  const filtrarFavoritos = () => {
    if (!termoPesquisa) return favoritos;
    
    const termo = termoPesquisa.toLowerCase();
    return favoritos.filter(
      favorito => favorito.titulo.toLowerCase().includes(termo) || 
                  favorito.url.toLowerCase().includes(termo)
    );
  };

  const getFavoritosFiltrados = () => {
    const favoritosFiltrados = filtrarFavoritos();
    
    // Se houver um termo de pesquisa, retorna todos os favoritos filtrados
    if (termoPesquisa) return favoritosFiltrados;
    
    // Caso contrário, retorna os favoritos organizados por seção
    return favoritos;
  };

  // Valor do contexto
  const value = {
    secoes,
    favoritos: getFavoritosFiltrados(),
    getFavoritosPorSecao,
    secoesFechadas,
    alternarSecao,
    adicionarSecao,
    atualizarSecao,
    excluirSecao,
    adicionarFavorito,
    atualizarFavorito,
    excluirFavorito,
    atualizarOrdemSecoes,
    atualizarOrdemFavoritos,
    termoPesquisa,
    setTermoPesquisa,
    carregando,
    toasts,
    adicionarToast,
    removerToast,
    recarregarDados: carregarDados
  };

  return (
    <FavoritosContext.Provider value={value}>
      {children}
    </FavoritosContext.Provider>
  );
};

export default FavoritosContext; 