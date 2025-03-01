import '../styles/components/card.css';
import Component from '../core/Component.js';
import { Card } from '.';
import { AppState } from '../state/localStorageState.ts';

interface CardListProps {
	cards: AppState['lists'][number]['cards'];
}

class CardList extends Component<CardListProps> {
	render() {
		const { cards } = this.props;

		// prettier-ignore
		return `
				${cards.map(card => `
					<div data-card-id="${card.id}" class="card" draggable="true">
						${new Card({ card }).render()}
					</div>`).join('')}
    `;
	}
}

export default CardList;
