import MyRoutes from './routes/MyRoutes'

// Redux
import { Provider } from 'react-redux';
import store from './store';



function App() {
  return (
    <div className="App">
      <Provider store = {store}>
        <MyRoutes />
      </Provider>
    </div>
  );
}

export default App;