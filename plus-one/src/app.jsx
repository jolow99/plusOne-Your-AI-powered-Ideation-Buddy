import * as React from 'react';
import ReactDOM from 'react-dom';

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
  const axios = require('axios').default;
  const API_URL = "https://plus-one-api.herokuapp.com/predict"
  const[stickies, setStickies] = React.useState([])
  const[output, setOutput] = React.useState()
  var count = stickies.length

  async function updateSelection() {
    let selectedItems = await miro.board.getSelection()
    setStickies(selectedItems.filter(item => item.type === 'sticky_note'))
    count = stickies.length
  }


  async function processSelection() {
    let stickyNoteList = []
    for (const stickyNote of stickies) {
      let note = stickyNote.content.replace(/<[^>]*>/g, '')
      stickyNoteList.push(note)
    }
    console.log(stickyNoteList)

    axios.post(API_URL, {
      inputs: stickyNoteList,
    })
    .then(function (response) {
      console.log(response)
      setOutput(response.data)
    })
    .catch(function (error) {
      console.log(error);
    });

    // Simple POST request with a JSON body using fetch
    // const requestOptions = {
    //     mode: 'no-cors',  
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ inputs: stickyNoteList })
    // };
    // fetch(API_URL, requestOptions)
    //     .then(response => response.json())
    //     .then(data => setOutput(data));

    // console.log(response)
    // console.log(data)
    // console.log(output)


    // // Send a post request to API_URL with the data
    // const response = await fetch(API_URL, {
    //   mode: 'no-cors',
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: {"inputs": stickyNoteList}
    // })
    // const output = await response.json()
    // console.log(output)


    let clusters = output["clusters"]
    let labels = output["labels"]

    // loop through count of clusters and labels
    for (let i = 0; i < clusters.length; i++) {
      let cluster = clusters[i]
      let label = labels[i]
      // create a text object with the label
      await miro.board.createText({
        content: label,
        x: Math.floor(Math.random() * 1000),
        y: Math.floor(Math.random() * 1000),
        width: 1000,
        height: 1000,
      })
      // loop through cluster and create sticky notes
      for (const note of cluster) {
        await miro.board.createStickyNote({
          content: note,
          x: Math.floor(Math.random() * 1000),
          y: Math.floor(Math.random() * 1000),
          width: 1000,
        })
      }
    }
  }

  return (
    <div className="grid wrapper">
      <div className="cs1 ce12">
        <h1>You selected {count} items</h1>

        <button
          className="button button-secondary"
          onClick = {updateSelection}
        >Update Selection
        </button>

        <button
          className="button button-primary"
          onClick={processSelection}
        >Generate
        </button>

      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
