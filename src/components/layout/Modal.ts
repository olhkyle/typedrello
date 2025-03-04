import '../../styles/components/modal.css';
import Component from '../../core/Component.ts';
import { AppState } from '../../state/localStorageState.ts';

interface ModalProps {
	lists: AppState['lists'];
	modal: AppState['modal'];
}

class Modal extends Component<ModalProps> {
	render() {
		const {
			lists,
			modal: { isOpen, isCardDescCreatorOpen, listId, cardId },
		} = this.props;

		const targetList = lists.find(list => list.id === listId);
		const targetCard = targetList?.cards.find(card => card.id === cardId);

		return `${
			isOpen
				? `<div class="modal-container">
							<div class="modal-header">
								<div class="modal-header-top">
									<h2 class="modal-label">Change Content</h2>
									<button class="bx bx-x modal-close-btn"></button>
								</div>
								<div class="modal-header-bottom">
									<i class='bx bx-window-alt'></i>
									<div class="modal-card-title">
										<textarea class="modal-card-title-textarea">${targetCard?.title}</textarea>
										<button type="button" class="save-card-title-btn">Save</button>
									</div>
								</div>
								<div class="modal-card-list-item-title">
									<span href="#"># ${lists.find(list => list.id === listId)?.title}</span>
								</div>
							</div>
							<div class="divider"></div>
							<div class="modal-body">
									<div class="modal-card-content-header">
										<div class="content-title-group">
											<i class="bx bx-water"></i>
											<div class="content-title-wrapper">
												<div class="content-title">Description</div>
												<span class="caution">Save your change 👉</span>
											</div>
										</div>
										${
											isCardDescCreatorOpen
												? `<div class="description-control">
														<button class="save-btn">Save</button>
														<button class="bx bx-x description-close-btn"></button>
													</div>`
												: ''
										}
									</div>
									<textarea class="modal-card-content-textarea" placeholder="Add a more detailed description">${targetCard?.description}</textarea>
								
							</div>
					</div>
					<div class="overlay"></div>`
				: ''
		}`;
	}
}

export default Modal;
