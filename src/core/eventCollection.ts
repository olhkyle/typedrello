/**
 * @type {[{type: string, selector : string, handler: e => void}]}
 */

type EventType = 'beforeunload' | 'dragstart' | 'dragend' | 'dragover' | 'drop' | 'click' | 'submit' | 'input' | 'keydown' | 'keyup';
type Selector = 'window' | null;
type Handler = (event: Event | KeyboardEvent | MouseEvent | DragEvent | TouchEvent | InputEvent | SubmitEvent) => void;

interface TEvent {
	type: EventType;
	selector: Selector;
	handler: Handler;
}

const eventCollection: TEvent[] = [];

export type { TEvent };
export default eventCollection;
