import '../styles/components/flowCreator.css';
import Component from '../core/Component.ts';
import { AppState } from '../state/localStorageState.ts';

interface FlowCreatorProps {
	lists: AppState['lists'];
	listCreator: AppState['listCreator'];
}

class FlowCreator extends Component<FlowCreatorProps> {
	render() {
		const {
			lists,
			listCreator: { isOpen },
		} = this.props;

		// prettier-ignore
		return `
      <div class="list-creator-container">
        ${isOpen ? 
					`<form class="list-creator">
						<input type="text" class="new-list-title" placeholder="Enter New List here!" autofocus maxLength="512"/>
						<div class="list-control">
							<button class="add-list-btn">Add List</button>
							<button type="button" class="bx bx-x list-creator-close-btn" ></button>
						</div>
					</form>` 
					: `<button class="list-creator-open-btn">+ Add ${lists.length ? 'another' : 'new'} list</button>`}
      </div>
    `;
	}
}

export default FlowCreator;
