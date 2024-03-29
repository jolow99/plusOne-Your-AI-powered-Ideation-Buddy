import * as React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

function App() {
  const API_URL = "https://plus-one-api-d6djkekpna-as.a.run.app/predict"
  let [count, setCount] = React.useState()
  let [loadingAPI, setLoadingAPI] = React.useState(false)
  let [loadingResults, setLoadingResults] = React.useState(false)

  async function createStickies(clusters_and_labels) {
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
    let clusters = clusters_and_labels.clusters[0]
    let labels = clusters_and_labels.labels[0]
    console.log("CREATING STICKIES CLUSTERS AND LABELS")
    console.log(clusters)
    console.log(labels)
    setLoadingResults(true)
    for (let i = 0; i < clusters.length; i++) {
      cluster = clusters[i]
      label = labels[i]
      sticky_x = 0
      sticky_y = 0
      frame = await miro.board.createFrame({
        title: "Cluster" + (i + 1),
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
        if (j%6 == 0) {
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

  function groupSingleClusters(clusters, labels) {
    // loop through clusters and group only clusters with only one element
    let clusters_and_labels = {}
    clusters_and_labels["clusters"] = []
    clusters_and_labels["labels"] = []

    let grouped_clusters = []
    let grouped_labels = []
    let single_clusters = []
    let cluster;
    let label;
    for (let i = 0; i < clusters.length; i++) {
      cluster = clusters[i]
      label = labels[i]
      if (cluster.length != 1) {
        grouped_clusters.push(cluster)
        grouped_labels.push(label)
      } else {
        single_clusters.push(cluster[0])
      }
    }
    // if single clusters exist
    clusters_and_labels["clusters"].push(grouped_clusters)
    clusters_and_labels["labels"].push(grouped_labels)
    if (single_clusters.length != 0) {
      // loop through single_clusters and push label to 
      clusters_and_labels["clusters"][0].push(single_clusters)
      clusters_and_labels["labels"][0].push("Others")
    }
    return clusters_and_labels
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
    let new_clusters_and_labels;
    console.log("raw input data:" + stickyNoteList)

    let data = { inputs: stickyNoteList }
    console.log("data:" + data)
    await axios.post(API_URL ,data )
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
      new_clusters_and_labels = groupSingleClusters(clusters, labels)
      createStickies(new_clusters_and_labels)
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  setInterval(updateCount, 1000)

  return (
    <div className="grid wrapper">
      <div className={`cs1 ce12 scroll`}>
        <div className="intro">
          <h2 className="light">
            Welcome to plusOne, your AI-powered categorisation buddy!
          </h2>
        </div>

        <div className='instructions'>
          <div className={`${count > 1 ? 'gray' : ''}`}>
            <h3>1. Select Post-Its</h3>
            <ul>
              <li>Select post-its which you want to categorise by highlighting them</li>
            </ul>
          </div>

          <div className={`${count < 2 ? 'gray' : ''}`}>
          <h3>2. Press Generate Button</h3>
            <ul>
              <li>Categories will be automatically generated in different frames</li>
              <li>A text summary of the post-its in each frame is included at the top</li>
            </ul>
            </div>
        </div>

        <div className='main'>
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
            : <button className={`button ${count > 1 ? "button-primary" : "button-secondary disabled"}`} onClick={generate}>Generate</button> 
          }
        </div>
    </div>
   </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
