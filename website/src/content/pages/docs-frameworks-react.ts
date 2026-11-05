import type { Page } from '../types.js';
import { section } from '../helpers.js';
import { codeBlock } from '../../html.js';
import { reactExample } from '../examples.js';

const page: Page = { path: '/docs/frameworks/react', title: 'React', group: 'Frameworks', description: 'Mount a graph with a ref and keep it synchronized with component props.', sections: [
    section('component', 'Create the component', `<p>A ref owns the graph instance. One effect creates and destroys it. A second effect applies data changes.</p>${codeBlock(reactExample, 'TSX')}`),
    section('updates', 'Add more reactive options', `<p>Include each reactive option in the update effect and its dependency list. For callbacks, update the graph when the callback prop changes.</p>${codeBlock(`useEffect(() => {
  graph.current?.update({ data, bodyType, onClick });
}, [data, bodyType, onClick]);`, 'TSX')}`),
  ] };

export default page;
