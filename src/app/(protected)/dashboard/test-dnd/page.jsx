"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const initialItems = [
  { id: "1", title: "Feature 1" },
  { id: "2", title: "Feature 2" },
  { id: "3", title: "Feature 3" },
];

export default function DragAndDropList() {
  const [items, setItems] = useState(initialItems);
  const [draggingId, setDraggingId] = useState(null);

  const handleDragStart = (start) => {
    setDraggingId(start.draggableId);
  };

  const handleDragEnd = (result) => {
    setDraggingId(null);

    if (!result.destination) return;

    const reordered = Array.from(items);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setItems(reordered);
  };

  const addItem = () => {
    const newId = Date.now().toString();
    setItems([...items, { id: newId, title: `Feature ${items.length + 1}` }]);
  };

  const removeItem = (id) => {
    if (draggingId === id.toString()) return;
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
      <h2>Sortable Features</h2>

      <button
        onClick={addItem}
        style={{
          marginBottom: "1rem",
          padding: "8px 16px",
          background: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        + Add Feature
      </button>

      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Droppable droppableId="features">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ minHeight: "50px" }}
            >
              {items.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        padding: "12px",
                        margin: "8px 0",
                        background: "#f1f1f1",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>{item.title}</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={draggingId === item.id.toString()}
                        style={{
                          background: "red",
                          color: "white",
                          border: "none",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          cursor:
                            draggingId === item.id.toString()
                              ? "not-allowed"
                              : "pointer",
                          opacity: draggingId === item.id.toString() ? 0.5 : 1,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
