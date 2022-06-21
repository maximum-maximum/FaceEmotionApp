import Lena from "../lena.jpg";

function Detection() {
  return (
    <div className="face-detection">
      <h3>Face Detection</h3>
      <div className="upper-content">
        <div className="source">
          <a id="source">Source</a>
          <img id="src-image" src={Lena} alt="lena" />
          <input type="file" id="input-file" />
        </div>
        <div className="output">
          <a id="output"></a>
          <canvas id="dest-canvas"></canvas>
          <br />
          <input
            type="button"
            className="button"
            value="顔検出"
            id="detectface-btn"
          />
          <input
            type="button"
            className="button"
            value="予測"
            id="predict-btn"
          />
          <input
            type="button"
            className="button"
            value="リセット"
            onclick="window.location.reload();"
          />
        </div>
      </div>
    </div>
  );
}

export default Detection;
