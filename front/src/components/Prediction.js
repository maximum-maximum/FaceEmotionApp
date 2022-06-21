function Prediction() {
  return (
    <div>
      <h3>Emotion Prediction</h3>
      <div className="bottom-content">
        <div className="selected-image">
          <a id="selected-image"></a>
          <canvas id="face-canvas"></canvas>
        </div>
        <div className="res">
          <a id="res"></a>
          <table className="result-table" id="result-table">
            <tr>
              <th id="emotion"></th>
              <th id="accuracy"></th>
            </tr>
            <tr className="result">
              <td className="emotion"></td>
              <td className="accuracy"></td>
            </tr>
            <tr className="result">
              <td className="emotion"></td>
              <td className="accuracy"></td>
            </tr>
            <tr className="result">
              <td className="emotion"></td>
              <td className="accuracy"></td>
            </tr>
            <tr className="result">
              <td className="emotion"></td>
              <td className="accuracy"></td>
            </tr>
            <tr className="result">
              <td className="emotion"></td>
              <td className="accuracy"></td>
            </tr>
            <tr className="result">
              <td className="emotion"></td>
              <td className="accuracy"></td>
            </tr>
            <tr className="result">
              <td className="emotion"></td>
              <td className="accuracy"></td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Prediction;
