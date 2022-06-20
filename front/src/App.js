import { ReactComponent as Github } from "./github.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />
      <Detection />
      <Prediction />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <div>
      <header>
        <h1>Face Emotion App</h1>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/maximum-maximum/FaceEmotionApp"
        >
          <Github />
        </a>
      </header>
    </div>
  );
}

function Detection() {
  return (
    <div>
      <p>hoge</p>
    </div>
  );
}

function Prediction() {
  return (
    <div>
      <p>hoge</p>
    </div>
  );
}

function Footer() {
  return (
    <div>
      <p>hoge</p>
    </div>
  );
}

export default App;
