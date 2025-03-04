import Component from '../core/Component.ts';
import { CardList } from './index.ts';
import { AppState } from '../state/localStorageState.ts';

interface ListItemProps {
	list: AppState['lists'][number];
}

class ListItem extends Component<ListItemProps> {
	render() {
		const {
			list: { title, cards, isCardCreatorOpen },
		} = this.props;

		// prettier-ignore
		return `
				<div class="list-item-container">
					<div class="list-item-header">
						<textarea class="list-item-title">${title.trim()}</textarea>
						<button class="delete-list-btn bx bx-x"></button>
					</div>
					<div class="card-list-container">${new CardList({ cards }).render()}</div>
					<div class="card-creator-container">
						${isCardCreatorOpen ? 
							`<form class="card-creator">
								<textarea class="new-card-title" placeholder="Enter a title for this card!" autofocus></textarea>
								<div class="card-control">
									<button class="add-card-btn">Add Card</button>
									<button type="button" class="card-creator-close-btn bx bx-x"/>
								</div>
							</form>` : 
							`<button class="card-creator-open-btn">Add a Card</button>`
						}
					</div>
				</div>
    `;
	}
}

export default ListItem;
