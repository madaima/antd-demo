import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import zhCN from 'antd/es/locale/zh_CN';
import ConfigProvider from 'antd/es/config-provider';
import { createRoot } from 'react-dom/client'


const root = createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>
)

// ReactDOM.render(
//   <ConfigProvider locale={zhCN}>
//     <App />
//   </ConfigProvider>
//   , document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
