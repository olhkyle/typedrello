// Object > EventTarget > Node > Element > HTMLElement

const propertyList = ['checked', 'value', 'selected'] as const;

const updateDOM = (parentNode: HTMLElement, realNode: HTMLElement, newNode: HTMLElement) => {
	// 1. If realNode doesn't exist and virtualNode exists, add new node on parentNode
	if (!realNode && newNode) {
		parentNode.appendChild(newNode);
		return;
	}

	// 2. If realNode exists and newNode doesn't exist, remove matched node from parentNode
	if (realNode && !newNode) {
		parentNode.removeChild(realNode);
		return;
	}

	// 3. If all realNodes and new newNodes are type of Text_Node and each textContent of realNode and newNode are different, change into newNode's textContent
	if (realNode.nodeType === Node.TEXT_NODE && newNode.nodeType === Node.TEXT_NODE) {
		if (realNode.textContent !== newNode.textContent) realNode.textContent = newNode.textContent;
		return;
	}

	// 4. If realNode or newNode are type of COMMENT_NODE, return `undefined`
	if (realNode.nodeType === Node.COMMENT_NODE || newNode.nodeType === Node.COMMENT_NODE) return;

	// 5. If Element.nodeName is totally different, then remove realNode and replaced with newNode. If Node is a tree with children Nodes, all child Nodes are rebuilt
	if (realNode.nodeName !== newNode.nodeName) {
		// insert newNode before realNode. realNode which is type of `Element` node exists necessarily
		parentNode.insertBefore(newNode, realNode);
		parentNode.removeChild(realNode);
		return;
	}

	/**
	 * 6. If Element.nodeNames are identical, check both sets of attributes to see if they are the same. If they are not, replace them all
	 * - If the attributes of newNode don't exist in realNode or if the attributes are not the same, add or modify the attributes in realNode to match with newNode
	 */
	for (const { name, value } of [...newNode.attributes]) {
		if (!realNode.hasAttribute(name) || realNode.getAttribute(name) !== value) {
			realNode.setAttribute(name, value);
		}
	}

	// 7. If the attributes of realNode don't exist in newNode, remove the targeted attributes from realNode to make realNode identical to newNode
	for (const { name } of [...realNode.attributes]) {
		if (!newNode.hasAttribute(name)) realNode.removeAttribute(name);
	}

	/**
	 * 8. There's a case where all of Element's properties are not identical, even if both nodes attributes are being identical
	 * only compare with these properties (checked / value / selected)
	 */

	// Type guard to ensure we're working with HTMLElements
	if (!realNode || !newNode || realNode.nodeType !== Node.ELEMENT_NODE || newNode.nodeType !== Node.ELEMENT_NODE) {
		return;
	}

	// 9. Now we need to cast realNode and newNode to a type that includes these properties
	const realElement = realNode as HTMLElement & Record<(typeof propertyList)[number], unknown>;
	const virtualElement = newNode as HTMLElement & Record<(typeof propertyList)[number], unknown>;

	propertyList.forEach(key => {
		if (realElement[key] !== undefined && virtualElement[key] !== undefined && realElement[key] !== virtualElement[key]) {
			realElement[key] = virtualElement[key];
		}
	});

	// 10. Recursively compares the element's childNodes and textNodes to update the DOM
	diff(realNode, newNode);
};

/**
 * Reconciliation (named diff algorithm)
 * - Using `innerHTML` or `replaceWith` to replace the existing DOM tree with a newly created DOM tree regenerates even identical nodes, which not only disadvantages performance but also causes side effects like losing focus
 * - Compares the existing DOM tree with the newly created DOM tree to selectively replace differing nodes, attributes, text, etc., efficiently updating the DOM
 *
 * - realDOM: The real DOM currently reflected in the DOM
 * - virtualDOM: The newly created virtual DOM
 * - Both realDOM and virtualDOM have their top-most parentNode as `$root` container
 *   Since the root container of the virtualDOM is a cloned object of the realDOM’s root container($root), DOM updates are applied to the realDOM.
 * 	 - const cloned = $root?.cloneNode(true);
 *
 */
const diff = (realDOM: HTMLElement, virtualDOM: HTMLElement) => {
	// In order to handle node's text, use childNodes instead of children
	const [realNodes, newNodes] = [[...realDOM.childNodes], [...virtualDOM.childNodes]];
	const maxLength = Math.max(realNodes.length, newNodes.length);

	for (let i = 0; i < maxLength; i++) {
		updateDOM(realDOM, realNodes[i] as HTMLElement, newNodes[i] as HTMLElement);
	}
};

export default diff;
