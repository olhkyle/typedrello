// Object > EventTarget > Node > Element > HTMLElement

const propertyList = ['checked', 'value', 'selected'] as const;

const updateDOM = (parentNode: HTMLElement, realNode: HTMLElement, virtualNode: HTMLElement) => {
	// 기존 node는 없고 새로운 node만 있다면 새로운 node를 추가한다.
	if (!realNode && virtualNode) {
		parentNode.appendChild(virtualNode);
		return;
	}

	// 기존 node는 있고 새로운 node는 없다면 기존 node를 제거한다.
	if (realNode && !virtualNode) {
		parentNode.removeChild(realNode);
		return;
	}

	// 기존 node와 새로운 node 모두 Text node고 기존 node와 새로운 node의 textContent가 다르면 새로운 textContent로 교체한다.
	if (realNode.nodeType === Node.TEXT_NODE && virtualNode.nodeType === Node.TEXT_NODE) {
		if (realNode.textContent !== virtualNode.textContent) realNode.textContent = virtualNode.textContent;
		return;
	}

	// 기존 node 또는 새로운 node가 comment node면 무시한다.
	if (realNode.nodeType === Node.COMMENT_NODE || virtualNode.nodeType === Node.COMMENT_NODE) return;

	// Element.nodeName이 다르면 기존 node를 제거하고 새로운 node로 교체한다. node가 자식을 가진 tree라면 자식 node들 모두 재구축된다.
	if (realNode.nodeName !== virtualNode.nodeName) {
		// realNode 앞에 virtualNode을 삽입한다. realNode는 반드시 존재하며 element node다.
		parentNode.insertBefore(virtualNode, realNode);
		parentNode.removeChild(realNode);
		return;
	}

	// ↓ element.nodeName이 동일한 경우, attribute를 확인해 동일하면 유지하고 다르면 변경한다.

	// virtualNode에 존재하는 어트리뷰트가 realNode에는 존재하지 않거나 어트리뷰트 값이 같지 않으면 realNode에 해당 어트리뷰트를 추가/변경해 virtualNode와 일치시킨다.
	for (const { name, value } of [...virtualNode.attributes]) {
		if (!realNode.hasAttribute(name) || realNode.getAttribute(name) !== value) {
			realNode.setAttribute(name, value);
		}
	}

	// realNode에 존재하는 어트리뷰트가 virtualNode에는 존재하지 않으면 realNode에서 해당 어트리뷰트를 제거해 virtualNode와 일치시킨다.
	for (const { name } of [...realNode.attributes]) {
		if (!virtualNode.hasAttribute(name)) realNode.removeAttribute(name);
	}

	/**
	 * element attribute를 일치시켜도 element property는 일치하지 않는 경우가 있다.
	 * checked/value/selected 프로퍼티만 비교한다.
	 */

	// Type guard to ensure we're working with HTMLElements
	if (!realNode || !virtualNode || realNode.nodeType !== Node.ELEMENT_NODE || virtualNode.nodeType !== Node.ELEMENT_NODE) {
		return;
	}

	// Now we need to cast realNode and virtualNode to a type that includes these properties
	const realElement = realNode as HTMLElement & Record<(typeof propertyList)[number], any>;
	const virtualElement = virtualNode as HTMLElement & Record<(typeof propertyList)[number], any>;
	propertyList.forEach(key => {
		if (realElement[key] !== undefined && virtualElement[key] !== undefined && realElement[key] !== virtualElement[key]) {
			realElement[key] = virtualElement[key];
		}
	});

	// element의 자식 node와 text를 재귀 비교해 DOM에 update한다.
	// eslint-disable-next-line no-use-before-define
	diff(realNode, virtualNode);
};

/**
 * Reconciliation
 * - innerHTML이나 replaceWith를 사용해 기존 DOM tree를 새롭게 생성된 DOM tree와 교체하면 완전히 동일한 node까지
 *   다시 생성해 교체하기 때문에 performance에서 불리할 뿐 아니라 focus를 잃는 등 부작용도 발생한다.
 * - 기존 DOM tree와 새롭게 생성된 DOM tree를 비교해 다른 node, attribute, text 등을 선택적으로 교체해 DOM을 효율적으로 update한다.
 *
 * @type {(realDOM: HTMLElement, virtualDOM: HTMLElement) => void)}
 * - realDOM: 현재 DOM에 반영되어 있는 real DOM
 * - virtualDOM: 새롭게 생성된 virtual DOM
 * - realDOM과 virtualDOM 모두 최상위 부모 node가 root container다.
 *   단, virtualDOM의 root container는 realDOM의 root container를 클론한 객체이므로 DOM update는 realDOM에 한다.
 *
 */
const diff = (realDOM: HTMLElement, virtualDOM: HTMLElement) => {
	// In order to handle node's text, use childNodes instead of children
	const [realNodes, virtualNodes] = [[...realDOM.childNodes], [...virtualDOM.childNodes]];
	const maxLength = Math.max(realNodes.length, virtualNodes.length);

	for (let i = 0; i < maxLength; i++) {
		updateDOM(realDOM, realNodes[i] as HTMLElement, virtualNodes[i] as HTMLElement);
	}
};

export default diff;
