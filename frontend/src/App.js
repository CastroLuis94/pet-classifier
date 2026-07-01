import { useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Camera from "./pages/Camera";
import Gallery from "./pages/Gallery";
import History from "./pages/History";
import Result from "./pages/Result";

function App() {
  const [classificationResult, setClassificationResult] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Mapeamos los nombres de las funciones exactamente como los espera CameraPage */}
          <Route 
            path="/camera" 
            element={
              <Camera 
                setCapturedImage={setCapturedImage} 
                setClassificationResult={setClassificationResult} 
              />
            } 
          />
          
          {/* Hacemos lo mismo para Gallery por si usa la misma estructura de estados directos */}
          <Route 
            path="/gallery" 
            element={
              <Gallery 
                setCapturedImage={setCapturedImage} 
                setClassificationResult={setClassificationResult} 
              />
            } 
          />
          
          <Route path="/history" element={<History />} />
          
          <Route 
            path="/result" 
            element={<Result result={classificationResult} image={capturedImage} />} 
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;