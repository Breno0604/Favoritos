import { useFavoritos } from '@/lib/favoritosContext'
import { FavoritosProvider } from '@/lib/favoritosContext'
import Header from '@/components/Header'
import ListaFavoritos from '@/components/ListaFavoritos'
import { ToastContainer } from '@/components/ui/toast'

// Componente para conectar o contexto de toast com o componente ToastContainer
const ToastManager = () => {
  const { toasts, removerToast } = useFavoritos()
  return <ToastContainer toasts={toasts} onClose={removerToast} />
}

function App() {
  return (
    <FavoritosProvider>
      <div className="w-full bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 w-full overflow-auto">
          <ListaFavoritos />
        </main>
        <ToastManager />
      </div>
    </FavoritosProvider>
  )
}

export default App
