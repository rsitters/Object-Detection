import React, { useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "./index.css";

function ObjectDetection() {
  //Set initial states
  const [imageURL, setImageURL] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //Colors used for bounding boxes
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
  
  //Function to upload the image
  const handleImageUpload = async (event) => {
    setIsLoading(true);
    const file = event.target.files[0];

    if (file) {
      //Loads COCO-SSD model if image is uploaded
      const model = await cocoSsd.load();
      const imageElement = document.createElement("img");

      //Performs object detection once image is uploaded 
      imageElement.onload = async () => {
        const predictions = await model.detect(imageElement);
        //Sets predictions, image url and stops loading
        setPredictions(predictions);
        setImageURL(URL.createObjectURL(file));
        setIsLoading(false);
      };

      //Loads the image
      imageElement.src = URL.createObjectURL(file);
    }
  };

  return (
    <div className="object-detection">
      <h1>Object Detection</h1>
      {/*Input so image can be uploaded*/}
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
                 //Scales predictions based on image size
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
                  //Sets the scaled predictions
                  setPredictions(scaledPredictions); 
                }}
              />
              {predictions.map((prediction, index) => (
                //Displays bounding boxes for detected objects
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
                  //Displays predictions with class and score
                  <div
                    key={index}
                    className="prediction"
                    style={{ color: prediction.color }}
                  >
                    {`${prediction.class} (${Math.round(
                      prediction.score * 100
                    )}% )`}
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