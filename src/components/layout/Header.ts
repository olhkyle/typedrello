import '../../styles/components/header.css';
import Component from '../../core/Component.ts';

class Header extends Component {
	render() {
		return `
     <header class="header">
        <a href="#" class="logo">
          <h1 class="logo-container">
            <img src="/assets/logo.gif"/>
          </h1>
        </a>
      </header>
    `;
	}
}

export default Header;
