import { useBoardData } from './hooks/useBoardData';
import Board from './components/Board';

function App() {
  const { state, actions } = useBoardData();

  return <Board boardState={state} actions={actions} />;
}

export default App;
