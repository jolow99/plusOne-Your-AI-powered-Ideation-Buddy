import * as React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

function App() {
  const API_URL = "https://plus-one-api-d6djkekpna-as.a.run.app/predict"
  let [count, setCount] = React.useState()
  let [loadingAPI, setLoadingAPI] = React.useState(false)
  let [loadingResults, setLoadingResults] = React.useState(false)

  async function createStickies(clusters, labels) {
    let create_start = new Date().getTime()
    let frame_x = 0
    let frame_y = 0
    let cluster;
    let label;
    let sticky_x;
    let sticky_y;
    let frame;
    let text_label;
    let note;
    let sticky;
    // loop through count of clusters and labels
    setLoadingResults(true)
    for (let i = 0; i < clusters.length; i++) {
      cluster = clusters[i]
      label = labels[i]
      sticky_x = 0
      sticky_y = 0
      frame = await miro.board.createFrame({
        title: "Cluster" + i,
        width: 8000,
        height: 4500,
      })
      console.log("creating frame" + i)
      text_label = await miro.board.createText({
        content: label,
        style: {
          fillColor: 'transparent', // Default value: transparent (no fill)
          fillOpacity: 1, // Default value: 1 (solid color)
          fontFamily: 'roboto', // Default font type for the text
          fontSize: 150, 
          textAlign: 'left', // Default alignment: left
        },
        width: 4000,
        x: sticky_x+4000,
        y: sticky_y+250,
       })
       await frame.add(text_label)
      

      // loop through index of cluster and create sticky notes
      for (let j = 0; j < cluster.length; j++) {
        note = cluster[j]
        if (j%5 == 0) {
          if (j != 0) {
            sticky_x = 0
            sticky_y += 600
            console.log("Moving sticky down by 600")
          }
          console.log("Not moving sticky")
        } else {
          sticky_x += 600
          console.log("Moving sticky right by 600")
        }
        sticky = await miro.board.createStickyNote({
          content: note,
          x: sticky_x+500,
          y: sticky_y+1000,
          shape: 'square',
          width: 500
        })
        await frame.add(sticky)
      }
      if (i%2 == 0) {
        if (i != 0) {
          frame_x = 0
          frame_y += 5000
          console.log("Moving frame down by 5000")
        }
        console.log("Not moving frame")
      } else {
        frame_x += 8500
        console.log("Moving frame right by 10000")
      }
      frame.x = frame_x
      frame.y = frame_y
      await frame.sync()
    }
    let create_end = new Date().getTime()
    console.log("Time taken for Writing: " + (create_end - create_start) + "ms") 
    console.log("Created stickies!")
    setLoadingResults(false)
  }

  async function updateCount() {
    let selectedItems = await miro.board.getSelection()
    let stickies = selectedItems.filter(item => item.type === 'sticky_note')
    setCount(stickies.length)
  }

  async function generate() {
    let api_start = new Date().getTime()
    setLoadingAPI(true)
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
      setLoadingAPI(false)
      let api_end = new Date().getTime()
      console.log("Time taken for API: " + (api_end - api_start) + "ms") 
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
        <div className='intro'>
          <h1 className='light'>Welcome to plusOne, your AI-powered categorisation buddy!</h1>
        </div>
        <div>
          <h1>You selected <span className='highlight'>{count}</span> items</h1>
          { loadingAPI ? 
            <div>
              <div className='loading'>
              <CircularProgress/>
              </div>
              <i>Clustering and Summarising Data...</i>
            </div>
            : loadingResults ? 
            <div>
              <div className='loading'>
              <CircularProgress/>
              </div>
              <i>Writing Results to Miro Board...</i>
            </div>
            : <button className="button button-primary" onClick={generate}>Generate</button> 
          }
        </div>
        <div>
          <h2><b>Instructions</b></h2>
          <h3>1. Select Post-Its</h3>
          <ul>
            <li>Select post-its which you want to categorise by highlighting them</li>
            <li>Drag-select or ctrl+click on the post-it to select it</li>
            <li>Ctrl+click on selected post-its to de-select it</li>
          </ul>

          <h3>2. Press Generate Button</h3>
            <ul>
              <li>Categories will be automatically generated in different frames</li>
              <li>A text summary of the post-its in each frame is included at the top</li>
            </ul>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
