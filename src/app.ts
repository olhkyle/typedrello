import type { TEvent } from './core/eventCollection';
import { Component } from './core';
import { initialState, loadState, saveState } from './state/localStorageState';
import { Header } from './components';
import Main from './components/layout/Main';

class App extends Component {
	$dragTarget: HTMLElement | null;
	selectedListId: number | null;
	selectedCardId: number | null;
	dropFromListIdx: number | null;
	dropFromListId: number | null;
	state: typeof initialState;

	constructor() {
		super({});
		console.log('initialize app');

		this.$dragTarget = null;
		this.selectedListId = null;
		this.selectedCardId = null;
		this.dropFromListIdx = null;
		this.dropFromListId = null;

		this.state = loadState();
		console.log('[Load State]', this.state);
	}

	render(): string {
		return `
      <div id="container">
        ${new Header({})?.render()}
				${new Main(this.state)?.render()}
      </div>
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
				handler: () => {},
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

			{ type: 'submit', selector: null, handler: this.onSubmit.bind(this) },
			{
				type: 'input',
				selector: null,
				handler: e => {
					if (e.target instanceof HTMLInputElement) {
						if (!e.target?.matches('textarea')) return;

						e.target.style.height = `${e.target.scrollHeight}px`;
					}
				},
			},
		];
	}

	onClick(event: Event | MouseEvent) {
		if (event.target instanceof HTMLButtonElement) {
			this.setState({ ...this.state, listCreator: { ...this.state.listCreator, isOpen: !this.state.listCreator.isOpen } });
			console.log(this.state, 'newState');
		}
		console.log('Element clicked:', event.target);
	}

	onSubmit(event: Event | SubmitEvent) {
		event.preventDefault();
		console.log('Submit', event.target);
	}

	onKeyDown(event: Event | KeyboardEvent) {
		console.log('KeyDown', event.target);
	}

	onDragStart(event: Event | DragEvent) {
		console.log('DragStart', event.target);
	}

	onDragEnd(event: Event | DragEvent) {
		console.log('DragEnd', event.target);
	}

	onDragOver(event: Event | DragEvent) {
		console.log('DragOver', event.target);
	}

	onDrop(event: Event | DragEvent) {
		console.log('Drop', event.target);
	}
}

export default App;
