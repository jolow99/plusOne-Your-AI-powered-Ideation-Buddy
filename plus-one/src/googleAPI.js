// Adds a new row to the Sheet.
import Sheet2API from 'sheet2api-js';
//https://sheet2api.com/v1/97Jq2YRtTeqd/one-plus


export default function PostToSheets(data){
    const url = 'https://sheet2api.com/v1/97Jq2YRtTeqd/one-plus';
    // const newRowData = { 'Qns 1': "Ans 1", 'Qns 2': "Ans 2", "Qns 3": "Ans 3"};
    
    const options = {};
    Sheet2API.write(url, options, data).then(function(result){
        console.log("RESULT")
        console.log(result);
        }, function(error){
        console.log("ERROR")
        console.log(error);
    });
}
