import '../styles/components/flow.css';
import Component from '../core/Component.js';
import { AppState } from '../state/localStorageState.ts';
import FlowItem from './FlowItem.ts';

interface FlowProps {
	lists: AppState['lists'];
}

class Flow extends Component<FlowProps> {
	render() {
		const { lists } = this.props;

		// prettier-ignore
		return `
      <div class="list-container">
        ${lists?.map((list, idx) => `
					<div class="list-item" data-list-index="${idx}" data-list-id="${list.id}" draggable="true">
						${new FlowItem({ list }).render()}
					</div>`).join('')}
      </div>
    `;
	}
}

export default Flow;
