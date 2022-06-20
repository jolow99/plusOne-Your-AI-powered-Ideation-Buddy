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
var clusters;

async function confirmSelection() {
  let selectedItems = await miro.board.getSelection()
  stickyNotes = selectedItems.filter(item => item.type === 'sticky_note')
  console.log(stickyNotes)
}

async function processSelection() {
  // loop through stickyNote of stickyNotes and add stickyNote.content to a list
  let stickyNoteList = []
  for (const stickyNote of stickyNotes) {
    stickyNoteList.push(stickyNote.content)
    console.log(stickyNoteList)
  }

  // Randomly group stickynotes into clusters 

  // Generate a list of random integers which add up to n
  let n = stickyNoteList.length
  let clusterLengths = []
  let cur = n
  while (cur > 0) {
    clusterLengths.push(Math.floor(Math.random() * cur) + 1)
    cur -= clusterLengths[clusterLengths.length - 1]
  }

  // Create clusters
  clusters = []
  for (const clusterLength of clusterLengths) {
    clusters.push(stickyNoteList.splice(0, clusterLength))
  }
  console.log(clusters)
}


async function createClusters() {
  for (const cluster of clusters) {
    let cluster_length = cluster.length.toString()
    await miro.board.createText({
      content: "Cluster" + cluster_length,
      x: Math.floor(Math.random() * 1000),
      y: Math.floor(Math.random() * 1000),
      width: 1000,
      height: 1000,
    })
    for (const note of cluster) {
      await miro.board.createStickyNote({
        content: note,
        x: Math.floor(Math.random() * 1000),
        y: Math.floor(Math.random() * 1000),
        width: 1000,
      })}
  }
  console.log(clusters)
}


function App() {
  React.useEffect(() => {
    console.log("Use effect ran")
  }, []);

  return (
    <div className="grid wrapper">
      <div className="cs1 ce12">
        
        <button
          className="button button-primary"
          onClick = {confirmSelection}
        >Confirm Selection
        </button>

        <button
          className="button button-secondary"
          onClick={processSelection}
        >Process Selection
        </button>

        <button
          className="button button-primary"
          onClick={createClusters}
        >Create Clusters
        </button>
          
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
