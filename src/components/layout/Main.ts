import Component from '../../core/Component.ts';
import { AppState } from '../../state/localStorageState.ts';
// import List from './List.js';
// import ListCreator from './ListCreator.js';

interface MainProps {
	lists: AppState['lists'];
	listCreator: AppState['listCreator'];
}

class Main extends Component {
	render() {
		const { lists, listCreator } = this.props as MainProps;

		return `
      <main id="layoutMain" class="main">
        <div>
        ${lists?.map(({ id }) => `<div>${id}</div>`).join('')}
        </div>
			</main>
    `;
	}
}

export default Main;
