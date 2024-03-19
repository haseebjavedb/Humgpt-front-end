import { Draggable } from "react-beautiful-dnd";
import OptionTag from "./OptionTag";
import { useState } from "react";

const DraggableItem = ({ item, index, selectedQuestion, confirmDelete, isDeleting, cancelDelete, handleEdit, initDelete }) => {
  const [showOptions, setShowOptions] = useState(false);

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
                  <div className='col-md-8'>
                    <div>
                      { item.question }
                      {(item.question_type === 'Options' && !showOptions) && <button className="btn btn-sm c-primary" onClick={() => setShowOptions(true)}> View Options</button>}
                      {showOptions && <button className="btn btn-sm c-primary" onClick={() => setShowOptions(false)}> Hide Options</button>}
                    </div>
                    {showOptions && <div>
                      {item.question_options.map(opt => {
                        return <OptionTag key={opt.id} option={opt.option} />
                      })}
                    </div>}
                  </div>
                  <div className="col-md-2">
                    <div class="badge text-bg-dark-soft rounded-pill px-2 py-1 fs-6 lh-sm">{ item.key }</div>
                  </div>
                  <div className='col-md-2 text-right'>
                    {selectedQuestion === item.id ? <div>
                        <button onClick={() => confirmDelete(item.id)} disabled={isDeleting} className="btn btn-outline-primary btn-sm">
                            <em class="icon ni ni-check"></em>
                        </button>
                        <button onClick={cancelDelete} disabled={isDeleting} className="btn btn-outline-danger btn-sm ml5">
                            <em class="icon ni ni-cross"></em>
                        </button>
                    </div> :
                    <div>
                        <button onClick={() => handleEdit(item)} className="btn btn-outline-primary btn-sm">
                            <em class="icon ni ni-edit"></em>
                        </button>
                        <button onClick={() => initDelete(item.id)} className="btn btn-outline-danger btn-sm ml5">
                            <em class="icon ni ni-trash"></em>
                        </button>
                    </div>}
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

export default DraggableItem;