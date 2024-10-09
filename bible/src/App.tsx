import { useParams } from 'react-router-dom';
import './App.css';
import Bible from './components/Bible';
import BibleNavigator from './components/BibleNavigator';

function App() {
  const params = useParams();

  return (
    <>

      <Bible
        abbrev={params.abbrev ?? ''}
        chapter={Number(params.chapter)}
        version={params.version ?? 'nvi'}
      />

      <BibleNavigator
        params={params}
      />

    </>
  );
}

export default App;
