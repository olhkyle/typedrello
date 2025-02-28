import './styles/globalStyle.css';
import './styles/font.css';
import App from './app';
import { renderDOM } from './core';

// like React SPA
renderDOM(App, document.getElementById('app')!);
