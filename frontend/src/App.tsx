import './App.css'
import Dashboard from './components/dashboard/Dashboard';

function App() {
  return (
    <div className="h-screen w-full bg-[url('./assets/images/background-image-02.jpg')] bg-cover bg-center">
      <div className="h-full w-full backdrop-blur-sm">
        <main className='p-3'>
          <Dashboard />
        </main>
      </div>
    </div>
  )
}

export default App
