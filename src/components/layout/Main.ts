import '../../styles/components/main.css';
import Component from '../../core/Component.ts';
import { Flow, FlowCreator } from '..';
import { AppState } from '../../state/localStorageState.ts';

interface MainProps {
	lists: AppState['lists'];
	listCreator: AppState['listCreator'];
}

class Main extends Component<MainProps> {
	render() {
		const { lists, listCreator } = this.props;

		return `
      <main id="layoutMain" class="main">
        ${new Flow({ lists })?.render()}
				${new FlowCreator({ listCreator, lists })?.render()}
			</main>
    `;
	}
}

export default Main;
