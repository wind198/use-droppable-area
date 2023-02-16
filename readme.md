# Use droppable area

## Introduction
    Drag and drop files to upload is a quite common case that web applications need to support. This hook allows you to render an area that you can drag and drop file on. You can customize the styling of the area and decide what to render in the area.

## Example

```javascript
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
        setUploadedFileList((p) => [...p, file]);
      }
    },
    children(isDraggingover) {
    // If user is dragging file over the area, display an image otherwise display an button to open file selection dialog
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
```
