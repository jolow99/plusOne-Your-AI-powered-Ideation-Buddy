// Adds a new row to the Sheet.
import Sheet2API from 'sheet2api-js';

//https://sheet2api.com/v1/97Jq2YRtTeqd/one-plus


export default function PostToSheets(data, setWritingData, setSuccessMessage){
    const url = 'https://sheet2api.com/v1/97Jq2YRtTeqd/one-plus';
    
    const options = {};
    data["Type"] = "short"
    Sheet2API.write(url, options, data).then(function(result){
        console.log("RESULT")
        console.log(result);
        setWritingData(false)
        setSuccessMessage("Form Successfully Submitted!")
        }, function(error){
        console.log("ERROR")
        console.log(error);
        setSuccessMessage("Form Submission Failed!")
    });
}

