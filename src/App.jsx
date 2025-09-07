import { useState } from "react";
import "./App.css"; // Import CSS file

function App() {
  const [color, setColor] = useState("white");

  const colors = [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "pink",
    "orange",
    "teal",
  ];

  const changeColor = () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setColor(randomColor);
  };

  return (
    <div className="app" style={{ backgroundColor: color }}>
      <h1 className="title">🎨 Color Changer App</h1>
      <button className="btn" onClick={changeColor}>
        Change Color
      </button>
      <p className="info">
        Current Color: <span className="highlight">{color}</span>
      </p>
    </div>
  );
}

export default App;
