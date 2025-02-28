import Component from '../../core/Component.ts';

class Header extends Component {
	render() {
		return `
      <header id="layoutHeader" class="header">
        <a href="#" class="logo">
          <div class="logo-container">
            Boost.
          </div>
        </a>
        <button class="logo-container list-button">
            Boost.
        </button>
      </header>
    `;
	}
}

export default Header;
