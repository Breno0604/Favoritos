import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ColorPicker } from '@/components/ui/color-picker';
import { useFavoritos } from '@/lib/favoritosContext';
import { DialogFooter } from '@/components/ui/dialog';

const FormAdicionarSecao = ({ secao, onSuccess }) => {
  const [titulo, setTitulo] = useState('');
  const [corFundo, setCorFundo] = useState('#f3f4f6');
  const [corTexto, setCorTexto] = useState('#111827');
  const [carregando, setCarregando] = useState(false);
  
  const { adicionarSecao, atualizarSecao } = useFavoritos();
  
  // Se estiver editando, preenche o formulário com os dados da seção
  useEffect(() => {
    if (secao) {
      setTitulo(secao.titulo || '');
      setCorFundo(secao.cor_fundo || '#f3f4f6');
      setCorTexto(secao.cor_texto || '#111827');
    }
  }, [secao]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!titulo) return;
    
    setCarregando(true);
    
    try {
      const dadosSecao = {
        titulo,
        cor_fundo: corFundo,
        cor_texto: corTexto,
      };
      
      if (secao?.id) {
        // Atualizar seção existente
        await atualizarSecao(secao.id, dadosSecao);
      } else {
        // Adicionar nova seção
        await adicionarSecao(dadosSecao);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao salvar seção:', error);
    } finally {
      setCarregando(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <label htmlFor="titulo" className="text-sm font-medium">
            Nome
          </label>
          <Input
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Nome da seção"
            required
          />
        </div>
        
        <ColorPicker
          label="Cor de fundo do cabeçalho"
          value={corFundo}
          onChange={setCorFundo}
        />
        
        <ColorPicker
          label="Cor do texto"
          value={corTexto}
          onChange={setCorTexto}
        />
        
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Pré-visualização</h3>
          <div 
            className="p-3 rounded flex items-center"
            style={{ backgroundColor: corFundo, color: corTexto }}
          >
            <span className="font-medium">{titulo || 'Nome da Seção'}</span>
          </div>
        </div>
      </div>
      
      <DialogFooter className="mt-6">
        <Button variant="outline" type="button" onClick={onSuccess}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!titulo || carregando}>
          {carregando ? 'Salvando...' : secao?.id ? 'Atualizar' : 'Salvar'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default FormAdicionarSecao; 