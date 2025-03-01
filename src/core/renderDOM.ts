import Component from './Component.js';
import diff from './diff.js';
import eventCollection from './eventCollection.js';

let $root: HTMLElement | null = null; // root container
let component: Component | null = null; // component instance

/**
 * - Apply all Event Handlers based on Event Object which are saved on eventCollection array
 * - All Event Handlers are delegate registered on root container($root)
 * - But, if the 'selector' property's value is 'window', Event Handler would be applied on window
 */
const bindEventHandler = ($root: HTMLElement) => {
	for (const { type, selector, handler } of eventCollection) {
		(selector === 'window' ? window : $root).addEventListener(type, handler);
	}
};

const renderDOM = (Component?: new (props: { $root: HTMLElement }) => Component, $container?: HTMLElement) => {
	if ($container) $root = $container;
	if (Component) {
		component = new Component({ $root: $container! });

		const DOMString = component?.render();

		if (DOMString === undefined) {
			throw new Error('Render method should return a valid DOM string');
		}

		if ($root) {
			$root.innerHTML = DOMString;
		}
	}

	const createNewTree = () => {
		const cloned = $root?.cloneNode(true);
		const DOMString = component?.render();

		if (cloned instanceof HTMLElement) {
			if (DOMString === undefined) {
				throw new Error('Render method should return a valid DOM string');
			}

			cloned.innerHTML = DOMString;
		}

		return cloned;
	};

	// reconciliation
	diff($root, createNewTree()!);

	// bind Events
	bindEventHandler($root!);
};

export default renderDOM;
