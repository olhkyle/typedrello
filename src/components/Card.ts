import '../styles/components/card.css';
import Component from '../core/Component.js';
import { AppState } from '../state/localStorageState.js';

interface CardProps {
	card: AppState['lists'][number]['cards'][number];
}

class Card extends Component<CardProps> {
	render() {
		const { card } = this.props;

		return `
				<div class="card-title">
					<p class="card-content">${card.title}</p>
					<button class="delete-card-btn bx bx-x"></button>
				</div>
				${card.description ? `<i class="bx bx-menu-alt-left has-desc"></i>` : ''}
		`;
	}
}

export default Card;
