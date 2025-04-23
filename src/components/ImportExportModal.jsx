import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DialogFooter } from '@/components/ui/dialog';
import { useFavoritos } from '@/lib/favoritosContext';
import { TOAST_TYPES } from '@/components/ui/toast';
import { Download, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

const ImportExportModal = ({ onClose }) => {
  const [arquivo, setArquivo] = useState(null);
  const [carregando, setCarregando] = useState(false);
  
  const { 
    secoes, 
    favoritos, 
    adicionarSecao, 
    adicionarFavorito, 
    adicionarToast, 
    recarregarDados 
  } = useFavoritos();
  
  const exportarDados = () => {
    try {
      // Criar um objeto para mapear os IDs das seções para seus nomes
      const mapeamentoSecoesNomes = {};
      secoes.forEach(secao => {
        mapeamentoSecoesNomes[secao.id] = secao.titulo;
      });
      
      // Preparar dados para exportação em formato simplificado (apenas 3 colunas)
      const dadosExport = favoritos.map(favorito => ({
        'Seção': mapeamentoSecoesNomes[favorito.secao_id] || 'Sem Seção',
        'Nome do Favorito': favorito.titulo,
        'URL': favorito.url
      }));
      
      // Criar workbook
      const wb = XLSX.utils.book_new();
      
      // Adicionar planilha de favoritos simplificada
      const ws = XLSX.utils.json_to_sheet(dadosExport);
      XLSX.utils.book_append_sheet(wb, ws, 'Favoritos');
      
      // Exportar arquivo
      XLSX.writeFile(wb, 'favoritos_export.xlsx');
      
      adicionarToast(TOAST_TYPES.SUCCESS, 'Dados exportados com sucesso');
      
      // Fechar modal
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      adicionarToast(TOAST_TYPES.ERROR, 'Erro ao exportar dados');
    }
  };
  
  const importarDados = async () => {
    if (!arquivo) {
      adicionarToast(TOAST_TYPES.WARNING, 'Selecione um arquivo para importar');
      return;
    }
    
    setCarregando(true);
    
    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Verificar se o arquivo tem a planilha de favoritos
          if (!workbook.SheetNames.includes('Favoritos')) {
            adicionarToast(TOAST_TYPES.ERROR, 'Formato de arquivo inválido');
            setCarregando(false);
            return;
          }
          
          // Ler dados dos favoritos
          const favoritosSheet = workbook.Sheets['Favoritos'];
          const favoritosData = XLSX.utils.sheet_to_json(favoritosSheet);
          
          // Mapa para armazenar nomes de seções e seus IDs
          const mapaSecoesIds = {};
          secoes.forEach(secao => {
            mapaSecoesIds[secao.titulo.toLowerCase()] = secao.id;
          });
          
          // Importar favoritos
          for (const favorito of favoritosData) {
            try {
              const secaoNome = favorito['Seção'] || 'Sem Seção';
              const tituloFavorito = favorito['Nome do Favorito'];
              const urlFavorito = favorito['URL'];
              
              if (!tituloFavorito || !urlFavorito) continue;
              
              // Verificar se a seção já existe
              let secaoId = mapaSecoesIds[secaoNome.toLowerCase()];
              
              // Se a seção não existir, criar uma nova
              if (!secaoId) {
                const novaSecao = await adicionarSecao({
                  titulo: secaoNome,
                  cor_fundo: '#f3f4f6',
                  cor_texto: '#111827',
                });
                
                secaoId = novaSecao.id;
                mapaSecoesIds[secaoNome.toLowerCase()] = secaoId;
              }
              
              // Adicionar o favorito
              await adicionarFavorito({
                titulo: tituloFavorito || 'Favorito sem título',
                url: urlFavorito,
                secao_id: secaoId,
                // Adicionar favicon automaticamente
                favicon: urlFavorito ? `https://www.google.com/s2/favicons?domain=${new URL(urlFavorito.startsWith('http') ? urlFavorito : `https://${urlFavorito}`).hostname}&sz=64` : '',
              });
            } catch (error) {
              console.error('Erro ao importar favorito:', error);
            }
          }
          
          adicionarToast(TOAST_TYPES.SUCCESS, 'Dados importados com sucesso');
          
          // Recarregar dados
          await recarregarDados();
          
          // Fechar modal
          if (onClose) {
            onClose();
          }
        } catch (error) {
          console.error('Erro ao processar arquivo:', error);
          adicionarToast(TOAST_TYPES.ERROR, 'Erro ao processar arquivo');
        } finally {
          setCarregando(false);
        }
      };
      
      reader.readAsArrayBuffer(arquivo);
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      adicionarToast(TOAST_TYPES.ERROR, 'Erro ao importar dados');
      setCarregando(false);
    }
  };
  
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Exportar Dados</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Exporte seus favoritos para um arquivo Excel que você pode manter como backup.
          </p>
          <Button 
            onClick={exportarDados} 
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar para Excel
          </Button>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-2">Importar Dados</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Importe favoritos a partir de um arquivo Excel com as colunas: Seção, Nome do Favorito e URL.
          </p>
          <div className="grid gap-4">
            <Input
              type="file"
              accept=".xlsx"
              onChange={(e) => setArquivo(e.target.files[0])}
              className="cursor-pointer"
            />
            <Button 
              onClick={importarDados} 
              disabled={!arquivo || carregando}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              {carregando ? 'Importando...' : 'Importar'}
            </Button>
          </div>
        </div>
      </div>
      
      <DialogFooter className="mt-6">
        <Button 
          variant="outline" 
          onClick={onClose}
        >
          Fechar
        </Button>
      </DialogFooter>
    </div>
  );
};

export default ImportExportModal; 