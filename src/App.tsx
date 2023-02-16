import { useState, DragEvent } from "react";
import useDroppableArea from "./core/hooks/useDroppableArea";
import csvImage from "./assets/csv.png";
import styles from "./App.module.css";

function App() {
  const [uploadedFileList, setUploadedFileList] = useState<File[]>([]);

  const { droppableBox } = useDroppableArea({
    areaStyle: {
      height: 400,
      aspectRatio: "1.67 / 1",
      backgroundColor: "pink",
      margin: "auto",
      borderRadius: "16px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    onDropCallback(e: DragEvent) {
      const file = e.dataTransfer.files?.[0];
      if (file) {
        console.log(file);
        setUploadedFileList((p) => [...p, file]);
      }
    },
    children(isDraggingover) {
      if (isDraggingover) {
        return <img className={styles.image} src={csvImage} alt="csv-file" />;
      }
      return (
        <div>
          <label className={styles.uploadButton}>
            Upload
            <input
              style={{ display: "none" }}
              type="file"
              name="input"
              id="input"
            />
          </label>
        </div>
      );
    },
  });
  return (
    <div>
      {droppableBox}
      <p>Uploaded files:</p>
      {uploadedFileList.length ? (
        <ul>
          {uploadedFileList.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      ) : (
        <p> No files</p>
      )}
    </div>
  );
}

export default App;
