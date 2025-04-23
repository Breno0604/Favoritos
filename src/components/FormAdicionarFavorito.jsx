import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFavoritos } from '@/lib/favoritosContext';
import { DialogFooter } from '@/components/ui/dialog';

const FormAdicionarFavorito = ({ favorito, onSuccess, secaoId }) => {
  const [titulo, setTitulo] = useState('');
  const [url, setUrl] = useState('');
  const [secaoSelecionada, setSecaoSelecionada] = useState('');
  const [favicon, setFavicon] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  const { secoes, adicionarFavorito, atualizarFavorito } = useFavoritos();
  
  // Se estiver editando um favorito existente, preencher o formulário
  useEffect(() => {
    if (favorito) {
      setTitulo(favorito.titulo || '');
      setUrl(favorito.url || '');
      setSecaoSelecionada(favorito.secao_id || '');
      setFavicon(favorito.favicon || '');
    } else if (secaoId) {
      setSecaoSelecionada(secaoId);
    }
  }, [favorito, secaoId]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!titulo || !url || !secaoSelecionada) return;
    
    // Verificar se a URL tem o protocolo, se não tiver, adicionar
    let urlFormatada = url;
    if (!urlFormatada.startsWith('http://') && !urlFormatada.startsWith('https://')) {
      urlFormatada = `https://${urlFormatada}`;
    }
    
    setCarregando(true);
    
    try {
      // Obter o favicon automaticamente
      const domain = new URL(urlFormatada).hostname;
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
      
      const dadosFavorito = {
        titulo,
        url: urlFormatada,
        secao_id: secaoSelecionada,
        favicon: faviconUrl
      };
      
      if (favorito?.id) {
        // Atualizar favorito existente
        await atualizarFavorito(favorito.id, dadosFavorito);
      } else {
        // Adicionar novo favorito
        await adicionarFavorito(dadosFavorito);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao salvar favorito:', error);
    } finally {
      setCarregando(false);
    }
  };
  
  const handleUrlChange = (e) => {
    const novaUrl = e.target.value;
    setUrl(novaUrl);
    
    // Tentar extrair o título do domínio caso o campo de título esteja vazio
    if (!titulo && novaUrl) {
      try {
        let urlParaAnalisar = novaUrl;
        if (!urlParaAnalisar.startsWith('http://') && !urlParaAnalisar.startsWith('https://')) {
          urlParaAnalisar = `https://${urlParaAnalisar}`;
        }
        
        const dominio = new URL(urlParaAnalisar).hostname;
        // Remover www. e extrair o nome do site
        const nomeSite = dominio.replace(/^www\./, '').split('.')[0];
        // Capitalizar a primeira letra
        setTitulo(nomeSite.charAt(0).toUpperCase() + nomeSite.slice(1));
      } catch (error) {
        // URL inválida, não faz nada
      }
    }
    
    // Atualizar a pré-visualização do favicon
    if (novaUrl) {
      try {
        let urlParaAnalisar = novaUrl;
        if (!urlParaAnalisar.startsWith('http://') && !urlParaAnalisar.startsWith('https://')) {
          urlParaAnalisar = `https://${urlParaAnalisar}`;
        }
        
        const dominio = new URL(urlParaAnalisar).hostname;
        setFavicon(`https://www.google.com/s2/favicons?domain=${dominio}&sz=64`);
      } catch (error) {
        // URL inválida, não atualiza o favicon
      }
    } else {
      setFavicon('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <label htmlFor="url" className="text-sm font-medium">
            URL
          </label>
          <Input
            id="url"
            type="text"
            value={url}
            onChange={handleUrlChange}
            placeholder="https://exemplo.com"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="titulo" className="text-sm font-medium">
            Nome
          </label>
          <Input
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Nome do favorito"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="secao" className="text-sm font-medium">
            Seção
          </label>
          <Select 
            value={secaoSelecionada} 
            onValueChange={setSecaoSelecionada}
            required
          >
            <SelectTrigger id="secao">
              <SelectValue placeholder="Selecione uma seção" />
            </SelectTrigger>
            <SelectContent>
              {secoes.map((secao) => (
                <SelectItem key={secao.id} value={secao.id}>
                  {secao.titulo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Pré-visualização</h3>
          <div className="p-3 border rounded flex items-center gap-2">
            {favicon && (
              <img src={favicon} alt="Favicon" className="w-5 h-5" />
            )}
            <span>{titulo || 'Nome do favorito'}</span>
          </div>
        </div>
      </div>
      
      <DialogFooter className="mt-6">
        <Button variant="outline" type="button" onClick={onSuccess}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={!titulo || !url || !secaoSelecionada || carregando}
        >
          {carregando ? 'Salvando...' : favorito ? 'Atualizar' : 'Salvar'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default FormAdicionarFavorito; 