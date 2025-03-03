const KEY = 'state';

type AppState = typeof initialState;

// mock
const initialState = {
	lists: [
		{
			id: 1,
			title: 'Tasks to Do',
			cards: [
				{ id: 1, title: 'React', description: 'my task' },
				{ id: 2, title: 'Angular', description: '' },
			],
			isCardCreatorOpen: false,
		},
		{
			id: 2,
			title: 'Doing Tasks',
			cards: [{ id: 3, title: 'Algorithm', description: '' }],
			isCardCreatorOpen: false,
		},
		{
			id: 3,
			title: 'Completed Tasks',
			cards: [
				{ id: 4, title: 'HTML', description: '' },
				{ id: 5, title: 'CSS', description: '' },
				{ id: 6, title: 'JavaScript', description: 'Must Todo' },
			],
			isCardCreatorOpen: false,
		},
	],
	listCreator: {
		isOpen: false,
	},
	modal: {
		isOpen: false,
		isCardDescCreatorOpen: false,
		listId: null,
		cardId: null,
	},
};

const loadState = () => {
	if (typeof window === 'undefined') {
		return initialState;
	}

	try {
		const storedState = localStorage.getItem(KEY);

		return storedState ? JSON.parse(storedState) : initialState;
	} catch (error) {
		console.error('Failed to parse localStorage state:', error);
		return initialState;
	}
};

const saveState = (newState: AppState) => {
	if (typeof window !== 'undefined') {
		try {
			localStorage.setItem(KEY, JSON.stringify(newState));
		} catch (error) {
			console.error('Failed to save state to localStorage:', error);
		}
	}
};
export type { AppState };
export { initialState, loadState, saveState };
