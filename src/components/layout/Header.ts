import '../../styles/components/header.css';
import Component from '../../core/Component.ts';

class Header extends Component {
	render() {
		return `
     <header class="header">
        <a href="#" class="logo">
          <h1 class="logo-container">
            <img src="/assets/TYPEDRELLO.svg"/>
          </h1>
        </a>
      </header>
    `;
	}
}

export default Header;
