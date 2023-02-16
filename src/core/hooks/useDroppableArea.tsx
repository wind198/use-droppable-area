import { debounce } from "lodash";
import {
  createElement,
  CSSProperties,
  DragEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";

export type IUseDroppableArea = {
  areaStyle?: CSSProperties;
  areaElementType?: any;
  onDropCallback?: (e: DragEvent) => void;
  onDragOverCallback?: (e: DragEvent) => void;
  onDragEnterCallback?: (e: DragEvent) => void;
  onDragLeaveCallback?: (e: DragEvent) => void;
  children?: (isDraggingover: boolean) => ReactNode;
};

export default function useDroppableArea(options?: IUseDroppableArea) {
  const {
    areaStyle = {},
    areaElementType,
    children,
    onDragEnterCallback,
    onDragLeaveCallback,
    onDragOverCallback,
    onDropCallback,
  } = options || {};

  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const [mouseOverArea, setMouseOverArea] = useState(false);

  const onDropHandler = useCallback(
    (e: DragEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onDropCallback && onDropCallback(e);
      setIsDraggingOver(false);
    },
    [onDropCallback]
  );

  const onDragOverHandler = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = "copy";
      }
      onDragOverCallback && onDragOverCallback(e);
    },
    [onDragOverCallback]
  );

  const onDragMoveOverHandler = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDraggingOver(true);
      onDragEnterCallback && onDragEnterCallback(e);
    },
    [onDragEnterCallback]
  );

  const onDragLeaveHandler = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDraggingOver(false);
      onDragLeaveCallback && onDragLeaveCallback(e);
    },
    [onDragLeaveCallback]
  );

  const droppableFog = useMemo(
    () => (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: mouseOverArea && !isDraggingOver ? "none" : "block",
        }}
        className="droppable-fog"
        onDrop={onDropHandler}
        onDragOver={onDragOverHandler}
        onDragEnter={onDragMoveOverHandler}
        onDragLeave={onDragLeaveHandler}
      ></div>
    ),
    [
      mouseOverArea,
      isDraggingOver,
      onDropHandler,
      onDragOverHandler,
      onDragMoveOverHandler,
      onDragLeaveHandler,
    ]
  );

  const droppableAreaMouseMoveOverHandler = useCallback(
    debounce(() => {
      setMouseOverArea(true);
    }, 250),
    []
  );
  const droppableAreaMouseLeaveHandler = useCallback(() => {
    setMouseOverArea(false);
  }, []);

  const droppableArea = useMemo(
    () =>
      createElement(
        areaElementType || "div",
        {
          style: { ...areaStyle, position: "relative" },
          className: "droppable-box",
          onMouseEnter: droppableAreaMouseMoveOverHandler,
          onMouseLeave: droppableAreaMouseLeaveHandler,
        },
        <>
          {droppableFog}
          {children && children(isDraggingOver)}
        </>
      ),
    [
      areaElementType,
      areaStyle,
      droppableAreaMouseMoveOverHandler,
      droppableAreaMouseLeaveHandler,
      droppableFog,
      children,
      isDraggingOver,
    ]
  );

  return {
    isDraggingOver,
    droppableBox: droppableArea,
  };
}
