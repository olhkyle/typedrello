import '../styles/components/list.css';
import Component from '../core/Component.js';
import { AppState } from '../state/localStorageState.ts';
import ListItem from './ListItem.ts';

interface ListProps {
	lists: AppState['lists'];
}

class List extends Component<ListProps> {
	render() {
		const { lists } = this.props;

		// prettier-ignore
		return `
      <div class="list-container">
        ${lists?.map((list, idx) => `
					<div class="list-item" data-list-index="${idx}" data-list-id="${list.id}" draggable="true">
						${new ListItem({ list }).render()}
					</div>`).join('')}
      </div>
    `;
	}
}

export default List;
