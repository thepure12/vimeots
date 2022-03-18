const WIDTH = 640;
const HEIGHT = 360;
var videos = {}


function createVimeots(data) {
    let video = {
        src: data.src,
        timestamps: data.timestamps,
        width: data.width ? data.width : WIDTH,
        height: data.height ? data.height : HEIGHT
    }
    videos[data.id] = video
    load(data.id, video);
}

function load(id, video) {
    let vimeots = document.querySelector("#" + id);
    vimeots.innerHTML += `<div id="${id}-frame-container"></div><div id="${id}-tsButtons" class="tsButtons"></div>`
    let tsButtons = document.querySelector(`#${id}-tsButtons`);
    tsButtons.innerHTML += "<h3>Contents</h3>";
    video.timestamps.forEach(function (ts) {
        let title = ts["title"];
        let stamp = ts["timestamp"];
        let tsButton = `<button val="${stamp}" onclick="tsClicked(this, '${id}')">${title}</button>`;
        tsButtons.innerHTML += tsButton;
    });
    updateFrame("0s", id);
}

function tsClicked(btn, id) {
    let ts = btn.getAttribute("val");
    updateFrame(ts, id);
}

function updateFrame(ts, id) {
    let video = videos[id]
    let html = `<iframe id="${id}-frame" src=${video.src}#t=${ts} width="${video.width}" height="${video.height}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
    let frameContainer = document.querySelector(`#${id}-frame-container`);
    frameContainer.innerHTML = html;
}