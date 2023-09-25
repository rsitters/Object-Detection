import React, { useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "./App.css";

function ObjectDetection() {
  const [imageURL, setImageURL] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const boundingBoxColors = [
    "red",
    "blue",
    "green",
    "orange",
    "purple",
    "cyan",
    "magenta",
    "yellow",
    "pink",
    "teal",
    "lime",
    "brown",
    "maroon",
    "navy",
    "olive",
    "gray",
    "violet",
    "indigo",
    "turquoise",
  ];
  

  const handleImageUpload = async (event) => {
    setIsLoading(true);
    const file = event.target.files[0];

    if (file) {
      const model = await cocoSsd.load();
      const imageElement = document.createElement("img");

      imageElement.onload = async () => {
        const predictions = await model.detect(imageElement);
        setPredictions(predictions);
        setImageURL(URL.createObjectURL(file));
        setIsLoading(false);
      };

      imageElement.src = URL.createObjectURL(file);
    }
  };

  return (
    <div className="object-detection">
      <h1>Object Detection</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {imageURL && (
            <div className="image-container">
              <img
                src={imageURL}
                alt="Uploaded"
                style={{ maxHeight: "400px" }}
                onLoad={() => {
                  const imageElement = document.querySelector(
                    ".image-container img"
                  );
                  const scaleX = imageElement.width / imageElement.naturalWidth;
                  const scaleY =
                    imageElement.height / imageElement.naturalHeight;

                  const scaledPredictions = predictions.map(
                    (prediction, index) => ({
                      class: prediction.class,
                      score: prediction.score,
                      bbox: [
                        prediction.bbox[0] * scaleX,
                        prediction.bbox[1] * scaleY,
                        prediction.bbox[2] * scaleX,
                        prediction.bbox[3] * scaleY,
                      ],
                      color: boundingBoxColors[index % boundingBoxColors.length],
                    })
                  );

                  setPredictions(scaledPredictions);
                }}
              />
              {predictions.map((prediction, index) => (
                <div
                  key={index}
                  className="bounding-box"
                  style={{
                    left: prediction.bbox[0],
                    top: prediction.bbox[1],
                    width: prediction.bbox[2],
                    height: prediction.bbox[3],
                    borderColor: prediction.color
                  }}
                >
                </div>
              ))}
              <div className="predictions-container">
                {predictions.map((prediction, index) => (
                  <div
                    key={index}
                    className="prediction"
                    style={{ color: prediction.color }}
                  >
                    {`${prediction.class} (${Math.round(
                      prediction.score * 100
                    )}%)`}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ObjectDetection;
