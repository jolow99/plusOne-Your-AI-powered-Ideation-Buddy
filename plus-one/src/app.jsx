import * as React from 'react';
import ReactDOM from 'react-dom';

async function addSticky() {
  const stickyNote = await miro.board.createStickyNote({
    content: 'Hello, World!',
  });

  await miro.board.viewport.zoomTo(stickyNote);
}

async function addShape() {
  const shape = await miro.board.createShape({
    content: '<p>This is a very yellow star shape.</p>',
    shape: 'star',
    style: {
      fillColor: '#FEFF45',
    },
    x: 3000,
    y: 4500,
    width: 280,
    height: 280,
  });

  await miro.board.viewport.zoomTo(shape);

}

var stickyNotes;

async function confirmSelection() {
  let selectedItems = await miro.board.getSelection()
  stickyNotes = selectedItems.filter(item => item.type === 'sticky_note')
}

async function addSelection() {
  for (const stickyNote of stickyNotes) {
    await miro.board.createShape({
      content: stickyNote.content,
      x: stickyNote.x,
      y: stickyNote.y,
      width: stickyNote.width,
      height: stickyNote.height
    }) 
  }
}

async function cluster() {
  // loop through stickyNote of stickyNotes and add stickyNote.content to a list
  let stickyNoteList = []
  for (const stickyNote of stickyNotes) {
    stickyNoteList.push(stickyNote.content)
    console.log(stickyNoteList)
  }
}

function App() {
  React.useEffect(() => {
    console.log("Use effect ran")
  }, []);

  return (
    <div className="grid wrapper">
      <div className="cs1 ce12">
        {/* <img src="/src/assets/congratulations.png" alt="" /> */}
        <h1>Welcome to PlusOne</h1>
      <input></input>
      </div>
      <div className="cs1 ce12">
        <button
          className="button button-primary"
          onClick = {addSticky}
        >Say Hello World
        </button>
        <button
          className="button button-secondary"
          onClick={confirmSelection}
        >Select Items
        </button>
        <button
          className="button button-primary"
          onClick={cluster}
        >Begin Clustering
        </button>
          
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
