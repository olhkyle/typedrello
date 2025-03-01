// Object > EventTarget > Node > Element > HTMLElement

interface HTMLElementPartialProperties {
	checked?: boolean;
	value?: string;
	selected?: boolean;
}

const propertyList: (keyof HTMLElementPartialProperties)[] = ['checked', 'value', 'selected'];

const updateAttributes = (oldNode: Element, newNode: Element) => {
	if (oldNode.tagName === newNode.tagName) {
		// check attribute
		if (!(oldNode instanceof Text) && !(newNode instanceof Text)) {
			// replace attribute
			for (const { name, value } of [...newNode.attributes]) {
				if (value !== oldNode.getAttribute(name)) oldNode.setAttribute(name, value);
			}

			// remove attribute
			for (const { name } of [...oldNode.attributes]) {
				if (!newNode.getAttribute(name) === undefined || newNode.getAttribute(name) === null) oldNode.removeAttribute(name);
			}
		}

		// check property
		if (oldNode instanceof HTMLElement && newNode instanceof HTMLElement) {
			for (const property of propertyList) {
				if (property in oldNode && property in newNode) {
					const oldValue = oldNode[property as keyof HTMLElement];
					const newValue = newNode[property as keyof HTMLElement];

					if (oldValue !== newValue) {
						(oldNode as unknown as Record<string, unknown>)[property] = (newNode as unknown as Record<string, unknown>)[property];
					}
				}
			}
		}
	}
};

const diff = (oldNode: Node | null, newNode: Node | null, parent: Node | null = null) => {
	if (parent) {
		// add new Node
		if (!oldNode && newNode) {
			if (!(newNode instanceof Node)) {
				console.warn('newNode is not a valid Node:', newNode);
				return;
			}

			parent.appendChild(newNode);
			return;
		}

		// remove old Node
		if (oldNode && !newNode) {
			parent.removeChild(oldNode);
			return;
		}

		// Text Node
		if (oldNode instanceof Text && newNode instanceof Text) {
			if (oldNode.nodeValue?.trim() === '') return;
			if (oldNode.nodeValue !== newNode.nodeValue) oldNode.nodeValue = newNode.nodeValue;

			return;
		}

		// Comment Node
		if (oldNode?.nodeType === Node.COMMENT_NODE || newNode?.nodeType === Node.COMMENT_NODE) return;

		// node's tagName
		if (oldNode instanceof HTMLElement && newNode instanceof HTMLElement) {
			if (oldNode?.tagName !== newNode?.tagName) {
				parent.replaceChild(newNode!, oldNode!);
				return;
			}
		}

		// update Attribute Nodes
		updateAttributes(oldNode as Element, newNode as Element);
	}

	const [oldNodes, newNodes] = [[...(oldNode?.childNodes || [])], [...(newNode?.childNodes || [])]];
	const maxLength = Math.max(oldNodes.length, newNodes.length);

	for (let i = 0; i < maxLength; i++) {
		diff(oldNodes[i], newNodes[i], oldNode);
	}
};

export default diff;
