//Initialize IPFS
const ipfs = window.IpfsHttpClient('localhost', '5001')


//Checking for File Upload
jQuery("input#customFile").change(function (event) {
    const files = event.target.files;

    //Converting the FileBlob to ArrayBuffer

    // Initialize an instance of the `FileReader`
    const reader = new FileReader();

    // Specify the handler for the `load` event
    reader.onload = async function (e) {
        const results = await ipfs.add(e.target.result)

        //update the video list
        updateVideoList({
            name: files[0].name,
            hash: results[0].hash,
            size: humanFileSize(files[0].size)
        })
    }

    // Read the file
    reader.readAsArrayBuffer(files[0])
});


//Listing the Available Video Files
const updateVideoList = details => {

    //Get the current video List
    let videos = JSON.parse(window.localStorage.getItem("videos")) || [];
    videos.push(details)

    //Update the video List
    window.localStorage.setItem("videos", JSON.stringify(videos));

    //update UI
    updateUI()
}

//Show Human Readable File Sizes 
function humanFileSize(size) {
    var i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

const updateUI = () => {
    //Get the current video List
    let videos = JSON.parse(window.localStorage.getItem("videos")) || [];

    //Clear the UI
    document.getElementById("videos").innerHTML = null

    //Fill the UI with all the videos
    //Using JS to create video elements
    for (let i = 0; i < videos.length; i++) {
        var div = document.createElement("div");
        var details = document.createElement("h5");
        var video = document.createElement("video");
        var videoSrc = document.createElement("source");

        videoSrc.src = `http://localhost:8080/ipfs/${videos[i].hash}`
        video.width = "500"
        video.controls = true

        details.innerHTML = videos[i].name + '(' + videos[i].size + ')';
        div.style.margin = "40px"

        video.appendChild(videoSrc)
        div.appendChild(details)
        div.appendChild(video)

        document.getElementById("videos").appendChild(div);
    }
}

//Clear List 
const clearList = () => {
    window.localStorage.clear()
    window.location = window.location.href
}


//Updating the UI on first page load
updateUI()