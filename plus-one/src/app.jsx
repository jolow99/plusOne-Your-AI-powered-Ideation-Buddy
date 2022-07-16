import * as React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

function App() {
  const API_URL = "https://plus-one-api-d6djkekpna-as.a.run.app/predict"
  let [count, setCount] = React.useState()

  async function createStickies(clusters, labels) {
    // loop through count of clusters and labels
    for (let i = 0; i < clusters.length; i++) {
      let cluster = clusters[i]
      let label = labels[i]
      let rel_x = 0
      let rel_y = 0
      let frame = await miro.board.createFrame({
        title: label,
        width: 8000,
        height: 4500,
      })
      console.log("creating frame" + i)
      // loop through index of cluster and create sticky notes
      for (let j = 0; j < cluster.length; j++) {
        let note = cluster[j]
        if (j%5 == 0) {
          rel_x = 0
          rel_y += 600
        } else {
          rel_x += 600
        }
        const sticky = await miro.board.createStickyNote({
          content: note,
          x: rel_x,
          y: rel_y,
          shape: 'square',
          width: 500
        })
        await frame.add(sticky)
      }
      frame.x = 10000*i
      frame.y = 0
      await frame.sync()
    }
    console.log("Created stickies!")
  }

  async function updateCount() {
    let selectedItems = await miro.board.getSelection()
    let stickies = selectedItems.filter(item => item.type === 'sticky_note')
    setCount(stickies.length)
  }

  async function generate() {
    let selectedItems = await miro.board.getSelection()
    let stickies = selectedItems.filter(item => item.type === 'sticky_note')
    let stickyNoteList = []
    for (const stickyNote of stickies) {
      let note = stickyNote.content.replace(/<[^>]*>/g, '')
      stickyNoteList.push(note)
    }
    console.log("raw input data:" + stickyNoteList)

    let data = { inputs: stickyNoteList }
    console.log("data:" + data)
    await axios.get(API_URL + "?inputs=" + JSON.stringify(stickyNoteList))
    .then(function (response) {
      console.log("raw response")
      console.log(response)
      let clusters = response.data.clusters
      let labels = response.data.labels
      console.log("clusters:" + clusters)
      console.log("labels:" + labels)
      createStickies(clusters, labels)
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  setInterval(updateCount, 1000)

  return (
    <div className="grid wrapper">
      <div className="cs1 ce12">
        <h1>You selected {count} items</h1>

        <button
          className="button button-primary"
          onClick={generate}
        >Generate
        </button>

        <h2><b>Instructions</b></h2>
        
        <h3><b>Select Post-Its</b></h3>
        <p>Highlight the post-its on the Miro board</p>

        <h3><b>Press Generate Button</b></h3>
        <p>Clusters will be automatically generated</p>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
