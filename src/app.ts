import './styles/components/app.css';
import type { TEvent } from './core/eventCollection';
import { Component } from './core';
import { AppState, loadState, saveState } from './state/localStorageState';
import { Header, Main, Modal } from './components';
import {
	findCardTitle,
	findListTitle,
	generateNextCardId,
	generateNextListId,
	getCardId,
	getListId,
	getListIndex,
	moveCard,
	moveList,
	removeListByClickedId,
	toggleIsCardCreatorOpen,
} from './state/controller';

class App extends Component {
	$dragTarget: HTMLElement | null;
	selectedListId: number | null;
	selectedCardId: number | null;
	dropFromListIdx: number | null;
	dropFromListId: number | null;
	maxScrollHeight: number;
	state: AppState;

	constructor() {
		super();

		this.$dragTarget = null;
		this.selectedListId = null;
		this.selectedCardId = null;
		this.dropFromListIdx = null;
		this.dropFromListId = null;
		this.maxScrollHeight = 500;

		this.state = loadState();
		console.log('[--- Load State ---]', this.state);
	}

	render() {
		return `
      <div id="container">
        ${new Header().render()}
				${new Main(this.state).render()}
      </div>
			${new Modal(this.state).render()}
    `;
	}

	addEventListener(): TEvent[] {
		return [
			{
				type: 'beforeunload',
				selector: 'window',
				handler: () => saveState(this.state),
			},
			{
				type: 'keydown',
				selector: 'window',
				handler: (event: Event) => {
					if (!(event instanceof KeyboardEvent)) return;

					if (event.key !== 'Escape') return;

					if (this.state.modal.isOpen) {
						this.closeModal();
					} else {
						this.closeAllCreator();
					}
				},
			},
			{ type: 'dragstart', selector: null, handler: this.onDragStart.bind(this) },
			{ type: 'dragend', selector: null, handler: this.onDragEnd.bind(this) },
			{ type: 'dragover', selector: null, handler: this.onDragOver.bind(this) },
			{ type: 'drop', selector: null, handler: this.onDrop.bind(this) },
			{
				type: 'click',
				selector: null,
				handler: this.onClick.bind(this),
			},
			{
				type: 'keydown',
				selector: null,
				handler: this.onKeyDown.bind(this),
			},
			{
				type: 'input',
				selector: null,
				handler: event => {
					if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
						if (!event.target?.matches('textarea')) return;

						const { scrollHeight } = event.target;

						if (scrollHeight <= this.maxScrollHeight) {
							event.target.style.height = 'auto';
							event.target.style.height = `${scrollHeight}px`;
						}
					}
				},
			},
			{ type: 'submit', selector: null, handler: this.onSubmit.bind(this) },
		];
	}

	/**
	 * Event Handler's Action
	 */
	updateListTitle({ listId, value }: { listId: number; value: string }) {
		const lists = this.state.lists.map(list => (list.id === listId ? { ...list, title: value } : list));

		this.setState({ lists });
	}

	toggleListCreatorButtons() {
		this.setState({ listCreator: { isOpen: !this.state.listCreator.isOpen } });
	}

	toggleCardCreatorButtons(target: HTMLElement) {
		const $listItem = target.closest('.list-item');

		if ($listItem instanceof HTMLElement) {
			const lists = toggleIsCardCreatorOpen(this.state.lists, +($listItem?.dataset.listId || 0));

			this.setState({ lists });
		}
	}

	addNewList(value: string) {
		this.setState({
			lists: [...this.state.lists, { id: generateNextListId(this.state.lists), title: value, cards: [], isCardCreatorOpen: false }],
		});
	}

	removeList(target: HTMLElement) {
		const lists = removeListByClickedId(this.state.lists, getListId(target));

		this.setState({ lists });
	}

	addCard({ target, value }: { target: HTMLElement; value: string }) {
		const cardId = generateNextCardId(this.state.lists.map(({ cards }) => cards).flat());

		const newCard = { id: cardId, title: value, description: '' };

		this.setState({
			lists: this.state.lists.map(list => (list.id === getListId(target) ? { ...list, cards: [...list.cards, newCard] } : list)),
		});
	}

	updateCardTitle(title: string) {
		this.setState({
			lists: this.state.lists.map(list =>
				list.id === this.selectedListId
					? {
							...list,
							cards: list.cards.map(card => (card.id === this.selectedCardId ? { ...card, title } : card)),
						}
					: list,
			),
		});
	}

	removeCard(target: HTMLElement) {
		const cardId = getCardId(target);
		const filterCard = (list: AppState['lists'][number]) => list.cards.filter(({ id }) => id !== cardId);

		const lists = this.state.lists.map(list => ({ ...list, cards: filterCard(list) }));

		this.setState({ lists });
	}

	// because of event delegation and dynamic DOM Creation, form's focus event temporarily maintains and we can't close form ($card-creator or $list-creator)
	// It means we have to close all creators at the same time
	closeAllCreator() {
		const isSomeListCardCreatorOpen = this.state.lists.filter(({ isCardCreatorOpen }) => isCardCreatorOpen).length;

		if (isSomeListCardCreatorOpen === 0 && !this.state.listCreator.isOpen) {
			return;
		}

		this.setState({
			lists: this.state.lists.map(list => ({ ...list, isCardCreatorOpen: false })),
			listCreator: { isOpen: false },
		});
	}

	closeListCardCreator(event: KeyboardEvent) {
		const $element = event.target;

		if ($element instanceof HTMLElement) {
			this.toggleCardCreatorButtons($element);
		}
	}

	toggleModal() {
		this.setState({
			modal: {
				...this.state.modal,
				isOpen: !this.state.modal.isOpen,
				listId: this.selectedListId,
				cardId: this.selectedCardId,
			},
		});
	}

	closeModal() {
		if (!this.state.modal.isOpen) return;

		this.setState({
			modal: { ...this.state.modal, isOpen: false },
		});
	}

	toggleModalDescription(isCardDescCreatorOpen: boolean) {
		this.setState({ modal: { ...this.state.modal, isCardDescCreatorOpen } });
	}

	makeModalDescriptionCautionActive(target: HTMLElement) {
		let $modalContainer: HTMLElement | null = null;

		if (target.closest('.modal-container')) {
			$modalContainer = target.closest('.modal-container');
		} else if (target.closest('.overlay')) {
			$modalContainer = target.closest('#root')!.querySelector('.modal-container');
		}

		if ($modalContainer) {
			const $caution = $modalContainer.querySelector('.caution');
			const $modalCardContentTextArea = $modalContainer.querySelector('.modal-card-content-textarea');

			if ($caution instanceof HTMLSpanElement) {
				$caution.style.display = 'block';
			}

			if ($modalCardContentTextArea instanceof HTMLTextAreaElement) {
				$modalCardContentTextArea.focus();
			}
		}
	}

	saveModalDescription(description: string) {
		this.setState({
			lists: this.state.lists.map(list =>
				list.id === this.selectedListId
					? {
							...list,
							cards: list.cards.map(card => (card.id === this.selectedCardId ? { ...card, description } : card)),
						}
					: list,
			),
			modal: { ...this.state.modal, isCardDescCreatorOpen: !this.state.modal.isCardDescCreatorOpen },
		});
	}

	addDragImage() {
		const $fragment = document.createElement('div');

		if (!this.$dragTarget) {
			throw new Error('Drag target is not defined'); // 또는 기본 요소 반환
		}

		const $fragmentChild = this.$dragTarget.cloneNode(true);

		if ($fragmentChild instanceof HTMLElement) {
			$fragmentChild.classList.add('fragment');

			$fragment.appendChild($fragmentChild);
			document.body.appendChild($fragment);
		}

		return $fragment;
	}

	removeDragImage() {
		const $fragment = document.querySelector('.fragment')?.parentNode;

		if ($fragment) {
			document.body.removeChild($fragment);
		}
	}

	// get Y coordinate of $elem's center
	getYCoordinateCenter($element: HTMLElement) {
		const { bottom, top } = $element.getBoundingClientRect();
		return (bottom - top) / 2;
	}

	// event Handlers
	onDragStart(event: Event) {
		if (!(event instanceof DragEvent)) return;

		const $element = event.target as HTMLElement | null;

		this.$dragTarget = $element;
		const $dragImage = this.addDragImage();

		if (this.$dragTarget) {
			if (event.dataTransfer) {
				event.dataTransfer.setDragImage($dragImage, event.offsetX * 2, event.offsetY * 2);
				event.dataTransfer.effectAllowed = 'move';
				console.log('drag start');

				this.dropFromListIdx = getListIndex(this.$dragTarget);
				this.dropFromListId = getListId(this.$dragTarget);

				this.$dragTarget.classList.add('drag');
			}
		}
	}

	onDragEnd() {
		this.$dragTarget?.classList.remove('drag');

		console.log('dragend');
		this.removeDragImage();
	}

	onDragOver(event: Event) {
		if (!(event instanceof DragEvent)) return;

		const $dropTarget = event.target as HTMLElement;
		const $dropList = $dropTarget.closest('.list-item') as HTMLElement | null;

		// Default option to allow $element to drop
		event.preventDefault();

		if ($dropList === null) return;

		if (this.$dragTarget?.matches('.list-item')) {
			if (this.$dragTarget === $dropList) return;

			// eslint-disable-next-line max-len
			const [prevDropFromIdx, currentDropToIdx] = [getListIndex(this.$dragTarget), getListIndex($dropList)];

			this.$dragTarget.parentNode?.insertBefore(
				this.$dragTarget,
				prevDropFromIdx > currentDropToIdx ? $dropList : $dropList.nextElementSibling,
			);

			[...document.querySelectorAll('.list-item')].forEach(($listItem, idx) => {
				if ($listItem instanceof HTMLElement) {
					$listItem.dataset.listIndex = `${idx}`;
				}
			});

			return;
		}

		if (this.$dragTarget?.matches('.card')) {
			const $cardListContainer = $dropList.querySelector('.card-list-container');

			// 1. there's no card in $cardListContainer
			// 2. If $dropTarget is same with $dropList
			if ($cardListContainer instanceof HTMLElement) {
				if ($cardListContainer.children.length === 0 || $dropTarget === $dropList) {
					$cardListContainer.appendChild(this.$dragTarget);
					return;
				}

				// if drop card on list which cards exist, it would be valid only dragging over other card which is not on its own to make drag event sortable
				if ($dropTarget === this.$dragTarget || !$dropTarget.matches('.card')) return;

				// 1. mouse pointer(cursor) is above the center of $dropTarget
				// - move $dragTarget to the front of $dropTarget
				// 2. mouse pointer(cursor) is below the center of $dropTarget
				// - move $dragTarget to the back of $dropTarget
				$cardListContainer.insertBefore(
					this.$dragTarget,
					event.offsetY < this.getYCoordinateCenter($dropTarget) ? $dropTarget : $dropTarget.nextSibling,
				);
			}
		}
	}

	onDrop() {
		if (this.$dragTarget?.matches('.list-item')) {
			const [prevDropFromIdx, currentDropToIdx] = [this.dropFromListIdx, getListIndex(this.$dragTarget)];

			if (prevDropFromIdx === currentDropToIdx) return;

			const lists = moveList(this.state.lists, prevDropFromIdx!, currentDropToIdx);

			// because of triggering dragend after drop, make setState call after push dragend event handler
			setTimeout(() => {
				this.setState({ lists });
			}, 10);
			console.log('drop');

			return;
		}

		if (this.$dragTarget?.matches('.card')) {
			const [cardId, prevDropFromId, currentDropToId] = [getCardId(this.$dragTarget), this.dropFromListId, getListId(this.$dragTarget)];

			if (this.$dragTarget?.parentNode instanceof HTMLElement) {
				// find CardElement which is same with $dragTarget's id
				const cardIndex = [...this.$dragTarget.parentNode.querySelectorAll('.card')].findIndex($card => {
					if ($card instanceof HTMLElement) {
						return cardId === +$card.dataset.cardId!;
					}
				});

				// because of triggering dragend after drop, make setState call after push dragend event handler
				setTimeout(() => {
					this.setState({
						lists: moveCard({ lists: this.state.lists, cardId, prevDropFromId: prevDropFromId!, currentDropToId, cardIndex }),
					});
				}, 10);
				console.log('drop');
			}
		}
	}

	onClick(event: Event) {
		if (!(event instanceof MouseEvent)) return;

		const $element = event.target as HTMLElement;

		if ($element.nodeName === 'A') event.preventDefault();

		// 1. click list-creator-open-btn & list-creator-close-btn
		if ($element.matches('.list-creator-open-btn') || $element.matches('.list-creator-close-btn')) {
			this.toggleListCreatorButtons();
		}

		// 2. click card-creator-open-btn & card-creator-close-btn
		if ($element.matches('.card-creator-open-btn') || $element.matches('.card-creator-close-btn')) {
			this.toggleCardCreatorButtons($element);
		}

		// 3. click add-list-btn
		if ($element.matches('.add-list-btn')) {
			if ($element.closest('.list-creator')) {
				const [$textArea] = [...$element.closest('.list-creator')!.children] as [HTMLTextAreaElement];

				const { value } = $textArea;
				$textArea.focus();

				if (value === '') {
					$textArea.blur();
					return;
				}

				this.addNewList(value);
			}
		}

		// 4. click delete-list-btn
		if ($element.matches('.delete-list-btn')) {
			this.removeList($element);
		}

		// 5. toggle Modal
		if ($element.closest('.card')) {
			// 6. click delete-card-card
			if ($element?.matches('.delete-card-btn')) {
				this.removeCard($element);
				return;
			}

			const $listItem = $element.closest('.list-item');
			const $card = $element.closest('.card');

			if ($listItem instanceof HTMLElement && $card instanceof HTMLElement) {
				this.selectedListId = +$listItem.dataset.listId!;
				this.selectedCardId = +$card.dataset.cardId!;
			}

			this.toggleModal();
		}

		// 7. close Modal
		if ($element.matches('.modal-close-btn') || $element?.matches('.overlay')) {
			if (this.state.modal.isCardDescCreatorOpen) {
				this.makeModalDescriptionCautionActive($element);
				return;
			}

			this.toggleModal();
		}

		// 8. make Modal Description active
		if ($element.matches('.modal-card-content-textarea')) {
			if (this.state.modal.isCardDescCreatorOpen) return;

			this.toggleModalDescription(true);
		}

		// 9. close Description textarea
		if ($element.matches('.description-close-btn')) {
			this.toggleModalDescription(false);
		}

		// 10. save Description
		if ($element.matches('.save-btn')) {
			if ($element.closest('.modal-card-content') instanceof HTMLElement) {
				const { value: description } = $element.closest('.modal-card-content')?.querySelector('textarea') as HTMLTextAreaElement;

				this.saveModalDescription(description);
			}
		}

		// 11. if Description Textarea is active and click Modal Container, do not close Modal and induce to save description on textarea
		if (this.state.modal.isCardDescCreatorOpen && $element.closest('.modal-container')) {
			if ($element.matches('.modal-card-content-textarea') || $element.closest('.description-control')) return;

			this.makeModalDescriptionCautionActive($element);
		}
	}

	onKeyDown(event: Event) {
		if (!(event instanceof KeyboardEvent)) return;

		if (event.isComposing) return;
		if (event.key !== 'Enter' && event.key !== 'Escape') return;

		if (event.key === 'Escape') {
			// window 'keydown' bind Event Handler -> event propagation works
			event.stopPropagation();

			const $element = event.target as HTMLInputElement | HTMLTextAreaElement;

			if ($element.matches('.new-list-title')) {
				this.toggleListCreatorButtons();
				return;
			}

			if ($element.matches('.new-card-title')) {
				this.closeListCardCreator(event);
				return;
			}

			if ($element.matches('.list-item-title')) {
				const listId = getListId($element);

				this.updateListTitle({ listId, value: $element.value });
			}

			if ($element.matches('.modal-card-title-textarea')) {
				const currentCardTitle = findCardTitle({
					lists: this.state.lists,
					listId: this.selectedListId!,
					cardId: this.selectedCardId!,
				});

				const { value } = $element;

				if (value === '' || value === currentCardTitle) {
					$element.value = currentCardTitle;
				}

				$element.blur();
			}

			if ($element.matches('.modal-card-content-textarea')) {
				this.toggleModalDescription(false);
			}
			$element.blur();
		}

		if (event.key === 'Enter') {
			const $element = event.target as HTMLInputElement | HTMLTextAreaElement;
			const value = $element.value.trim();

			if ($element.matches('.list-item-title')) {
				const listId = getListId($element);
				const currentValue = findListTitle({ lists: this.state.lists, listId });

				if (value === '') {
					$element.value = currentValue;

					$element.blur();
					return;
				}

				if (value !== currentValue) {
					this.updateListTitle({ listId, value });
				}

				$element.blur();
			}

			if ($element.matches('.new-list-title')) {
				if (value === '') return;

				this.addNewList(value);
			}

			if ($element.matches('.new-card-title')) {
				event.preventDefault(); // block new line

				if (value !== '') this.addCard({ target: $element, value });
			}

			if ($element.matches('.modal-card-title-textarea')) {
				event.preventDefault(); // block new line

				const currentCardTitle = findCardTitle({
					lists: this.state.lists,
					listId: this.selectedListId!,
					cardId: this.selectedCardId!,
				});

				if (value === '' || value === currentCardTitle) {
					$element.value = currentCardTitle;
					return;
				}

				this.updateCardTitle(value);

				$element.blur();
			}
		}
	}

	onSubmit(event: Event) {
		if (!(event instanceof SubmitEvent)) return;

		event.preventDefault();

		const $element = event.target as HTMLFormElement;
		const $textArea = $element.querySelector('textarea');
		const value = $textArea?.value.trim() || '';

		if ($element?.matches('.card-creator')) {
			if (value === '') return;

			this.addCard({ target: $element, value });
		}
	}
}

export default App;
