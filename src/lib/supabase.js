import { createClient } from '@supabase/supabase-js';

// Substitua essas variáveis pelas suas credenciais do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Inicializa o cliente do Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Funções para interagir com as seções
export const getSecoes = async () => {
  try {
    const { data, error } = await supabase
      .from('secoes')
      .select('*')
      .order('ordem', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar seções:', error);
    return [];
  }
};

export const adicionarSecao = async (secao) => {
  try {
    const { data, error } = await supabase
      .from('secoes')
      .insert([secao])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao adicionar seção:', error);
    throw error;
  }
};

export const atualizarSecao = async (id, secao) => {
  try {
    const { data, error } = await supabase
      .from('secoes')
      .update(secao)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao atualizar seção:', error);
    throw error;
  }
};

export const excluirSecao = async (id) => {
  try {
    const { error } = await supabase
      .from('secoes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao excluir seção:', error);
    throw error;
  }
};

export const atualizarOrdemSecoes = async (secoes) => {
  try {
    const updates = secoes.map((secao, index) => ({
      id: secao.id,
      titulo: secao.titulo,
      cor_fundo: secao.cor_fundo,
      cor_texto: secao.cor_texto,
      ordem: index
    }));
    
    const { error } = await supabase.from('secoes').upsert(updates);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao atualizar ordem das seções:', error);
    throw error;
  }
};

// Funções para interagir com os favoritos
export const getFavoritos = async (secaoId = null) => {
  try {
    let query = supabase
      .from('favoritos')
      .select('*')
      .order('ordem', { ascending: true });
    
    if (secaoId) {
      query = query.eq('secao_id', secaoId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error);
    return [];
  }
};

export const adicionarFavorito = async (favorito) => {
  try {
    const { data, error } = await supabase
      .from('favoritos')
      .insert([favorito])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao adicionar favorito:', error);
    throw error;
  }
};

export const atualizarFavorito = async (id, favorito) => {
  try {
    const { data, error } = await supabase
      .from('favoritos')
      .update(favorito)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao atualizar favorito:', error);
    throw error;
  }
};

export const excluirFavorito = async (id) => {
  try {
    const { error } = await supabase
      .from('favoritos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao excluir favorito:', error);
    throw error;
  }
};

export const atualizarOrdemFavoritos = async (favoritos) => {
  try {
    const updates = favoritos.map((favorito, index) => ({
      id: favorito.id,
      ordem: index,
      secao_id: favorito.secao_id
    }));
    
    const { error } = await supabase.from('favoritos').upsert(updates);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao atualizar ordem dos favoritos:', error);
    throw error;
  }
};

export default supabase; 