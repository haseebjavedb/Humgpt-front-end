import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const Item = ({ item, index }) => {
  return (
    <Draggable draggableId={item.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="row"
        >
          <div className='col-12'>
            <div className='card' {...provided.dragHandleProps}>
              <div className='card-body'>
                <div className='row'>
                  <div className='col-md-10'>
                    { item.name } this is a complete question with all the details
                  </div>
                  <div className='col-md-2'>
                    <button onClick={() => {
                      alert();
                    }} className="btn btn-outline-primary btn-sm">
                        <em class="icon ni ni-eye"></em>
                    </button>
                    <button className="btn btn-outline-primary btn-sm">
                        <em class="icon ni ni-edit"></em>
                    </button>
                    <button className="btn btn-outline-danger btn-sm ml5">
                        <em class="icon ni ni-trash"></em>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {provided.placeholder}
        </div>
      )}
    </Draggable>
  );
};

const DragDrop = () => {
    let defaultItems = [
        {id: 1, name: "Test 1"},
        {id: 2, name: "Test 2"},
        {id: 3, name: "Test 3"},
        {id: 4, name: "Test 4"},
        {id: 5, name: "Test 5"},
        {id: 6, name: "Test 6"},
        {id: 7, name: "Test 7"},
        {id: 8, name: "Test 8"},
        {id: 9, name: "Test 9"},
        {id: 10, name: "Test 10"},
    ]
  const [items, setItems] = useState(defaultItems);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const newItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    setItems(newItems);
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {items.map((item, index) => (
              <Item
                key={item.id}
                item={item}
                index={index}
                deleteItem={deleteItem}
              />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DragDrop;

