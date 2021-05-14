
import auth from './utils/auth.js';
import VersionerPage from './pages/VersionerPage.vue';
//import PinPage from './pages/PinPage.vue';

let authenticated = auth.valid();
//let Versioner = authenticated  ? VersionerPage : PinPage;
//uncommit to enable simple pin auth.
export const routes = [
	{ path: '', component: VersionerPage, props: { authenticated: authenticated} },
	{ path: '/versioner', component: VersionerPage, props: { authenticated: authenticated} },
];
