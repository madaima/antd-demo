import React, { FC } from 'react';
import AccountList from './pages/account-list/account-list';
import './App.less';



const App: FC = () => (
  <div className="App">
    <AccountList give={{ haha: 1 }} />
  </div>
);

export default App;