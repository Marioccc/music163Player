var soundCloud={};

soundCloud.creadCard=(imgsrc,address,name)=>{
    var cardContainer = document.querySelector(".cards");

    var card = document.createElement("div");
    card.classList.add("card");

    var imgContainer = document.createElement("div");
    imgContainer.classList.add("image");
    var img = document.createElement("img");
    img.src=imgsrc;
    img.classList.add("image_img");
    imgContainer.appendChild(img);

    var contentContainer = document.createElement("div");
    contentContainer.classList.add("content");
    var header = document.createElement("div");
    header.classList.add("header");
    var link = document.createElement("a");
    var audio = document.createElement("audio");
    audio.src=address;
    audio.controls=true;
    link.href=address;
    link.innerText=name;
    header.appendChild(link);
    header.appendChild(audio);
    contentContainer.appendChild(header);

    var bottom = document.createElement("div");
    bottom.classList.add("ui","bottom","attached","button","js-button");    
    var bottom_i = document.createElement("i");
    bottom_i.classList.add("add","icon");
    var bottom_span = document.createElement("span"); 
    bottom_span.innerText="Add to playlist";
    bottom.appendChild(bottom_i);
    bottom.appendChild(bottom_span);

    card.appendChild(imgContainer);
    card.appendChild(contentContainer);
    card.appendChild(bottom);
    cardContainer.appendChild(card);
};

soundCloud.requestUrl = "http://localhost:3000";

let songData=fetch(soundCloud.requestUrl+"/search?keywords=像鱼")
.then(response=>songData=response.json());

songData.then(response=>{
    response.result.songs.forEach(async item => {
        // request song url
        let urlResponse =await fetch(soundCloud.requestUrl+"/song/url?id="+item.id);
        let urlObj =await urlResponse.json();
        let songUrl = urlObj.data[0].url;
        // request song img
        let imgResponse =await fetch(soundCloud.requestUrl+"/song/detail?ids="+item.id);
        let imgObj =await imgResponse.json();
        let songImg = imgObj.songs[0].al.picUrl;
        // request song name
        let songName = imgObj.songs[0].name;
        // Add To Dom
        soundCloud.creadCard(songImg,songUrl,songName);
    });
});
