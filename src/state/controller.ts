import { AppState } from './localStorageState';

type TLists = AppState['lists'];

// $element.closest('className') returns Element | null
const getListId = ($element: HTMLElement): number => {
	const $listItem = $element.closest('.list-item');

	// 'dataset.prop' is inferred as 'string | undefined' type.
	// 'dataset' has DOMStringMap type. if DOM element doesn't have dataset, it will return 'undefined'
	return $listItem instanceof HTMLElement ? +($listItem.dataset.listId || 0) : 0;
};

const getListIndex = ($element: HTMLElement): number => {
	const $listItem = $element.closest('.list-item');
	return $listItem instanceof HTMLElement ? +($listItem.dataset.listIndex || 0) : 0;
};

const getCardId = ($element: HTMLElement): number => {
	const $card = $element.closest('.card');
	return $card instanceof HTMLElement ? +($card.dataset.cardId || 0) : 0;
};

const findListTitle = ({ lists, listId }: { lists: TLists; listId: number }) => lists.find(({ id }) => id === listId)?.title ?? '';

const findCardTitle = ({ lists, listId, cardId }: { lists: TLists; listId: number; cardId: number }) => {
	const targetList = lists.find(list => list.id === listId);

	return targetList?.cards.find(card => card.id === cardId)?.title ?? '';
};

const generateNextListId = (lists: TLists) => Math.max(...lists.map(({ id }) => id), 0) + 1;

const generateNextCardId = (cards: TLists[number]['cards']) => Math.max(...cards.map(({ id }) => id), 0) + 1;

const toggleIsCardCreatorOpen = (lists: TLists, listId: number) =>
	lists.map(list => (list.id === listId ? { ...list, isCardCreatorOpen: !list.isCardCreatorOpen } : list));

const removeListByClickedId = (lists: TLists, listId: number) => lists.filter(({ id }) => id !== listId);

const moveList = (lists: TLists, dropFromIdx: number, dropToIdx: number) => {
	const filteredLists = [...lists].filter((_, idx) => idx !== dropFromIdx);
	filteredLists.splice(dropToIdx, 0, lists[dropFromIdx]);

	return filteredLists;
};

const moveCard = ({
	lists,
	cardId,
	prevDropFromId,
	currentDropToId,
	cardIndex,
}: {
	lists: TLists;
	cardId: number;
	prevDropFromId: number;
	currentDropToId: number;
	cardIndex: number;
}) => {
	const card = lists.flatMap(list => list.cards).find(({ id }) => id === +cardId);

	const listsOfRemovedCard = lists.map(list =>
		list.id === +prevDropFromId ? { ...list, cards: list.cards.filter(({ id }) => id !== card?.id) } : list,
	);

	return listsOfRemovedCard.map(list =>
		list.id === +currentDropToId ? { ...list, cards: [...list.cards.slice(0, cardIndex), card, ...list.cards.slice(cardIndex)] } : list,
	);
};

export {
	getListId,
	getListIndex,
	getCardId,
	findListTitle,
	findCardTitle,
	generateNextListId,
	generateNextCardId,
	toggleIsCardCreatorOpen,
	removeListByClickedId,
	moveList,
	moveCard,
};
