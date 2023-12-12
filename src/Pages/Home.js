import '../App.css';
import withAuthCheck from '../components/AuthComponent'
function Home() {
    return (
        <div className={"App"}>
            <p>Test</p>
        </div>
    );
}

export default withAuthCheck(Home);
