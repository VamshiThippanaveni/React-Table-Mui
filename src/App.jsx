
import './App.css'
import Table from './Components/Table'
import mockdata from './Data/MOCK_DATA.json'

function App() {

  return (
    <>
      <Table data={mockdata}/>
    </>
  )
}

export default App
