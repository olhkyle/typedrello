import { eventCollection, renderDOM } from '.';
import { TEvent } from './eventCollection';

interface ComponentProps {
	[key: string]: any;
}

type State = Record<string, any>;

class Component {
	props?: ComponentProps;
	state?: State;

	constructor(props: ComponentProps = {}) {
		this.props = props;
		this.#applyEvents();
	}

	setState(newState: State) {
		this.state = { ...this.state, ...newState };
		console.log(`[Rerender with STATE]:`, this.state);

		renderDOM();
	}

	addEventListener?(): TEvent[] {
		return [];
	}

	#applyEvents() {
		const events = this.addEventListener?.();
		if (!events) return;

		for (const event of events) {
			if (event.selector === 'window' || event.selector === null) {
				eventCollection.push(event);
				continue;
			}

			const checkDuplicate = eventCollection.find(({ type, selector }) => type === event.type && selector === event.selector);

			if (!checkDuplicate) {
				const { selector, handler } = event;

				event.handler = e => {
					if (e.target instanceof Element && (e.target?.matches(selector) || e.target?.closest(selector))) {
						handler(e);
					}
				};

				eventCollection.push(event);
			}
		}
	}

	render() {
		throw new Error(`Sub Class of Component should implement 'Render' method which returns DOMString`);
	}
}

export default Component;
