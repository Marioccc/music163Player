var UI={};
UI.keyboardClick=()=>{
    document.querySelector(".input-search").addEventListener("keyup",e=>{
        if(e.keyCode===13){
            soundCloud.search(document.querySelector(".input-search").value);
        }
    })
};
UI.buttonClick=()=>{
    document.querySelector(".js-submit").addEventListener("click",()=>{
        soundCloud.search(document.querySelector(".input-search").value);
    })
};
UI.keyboardClick();
UI.buttonClick();


var soundCloud={};
soundCloud.localData=[];
soundCloud.creadListItem=(src)=>{
    var playList = document.querySelector(".js-playlist");

    var inner = document.createElement("div");
    inner.classList.add("inner");

    var i = document.createElement("i");
    i.classList.add("icon","close");
    i.onclick=function () {
        playList.removeChild(this.parentElement);
        localStorage.setItem("key",playList.innerHTML);
    };
    var iframe = document.createElement("iframe");
    iframe.frameBorder="0";
    iframe.marginWidth="0";
    iframe.marginHeight="0";
    iframe.width="100%";
    iframe.height="100";
    iframe.src=src;
    inner.appendChild(i);
    inner.appendChild(iframe);
    playList.insertBefore(inner,playList.childNodes[0]);
};
soundCloud.init=()=>{
    var playList = document.querySelector(".js-playlist");
    playList.innerHTML=localStorage.getItem("key");
    var items = document.getElementsByClassName("close");
    for(var i=0;i<items.length;i++){
        items[i].addEventListener("click",function(){
            playList.removeChild(this.parentElement);
            localStorage.setItem("key",playList.innerHTML);
        })
    }
};
soundCloud.init();


soundCloud.renderToList=(id)=>{
    var url = "//music.163.com/outchain/player?type=2&id="+id+"&auto=1&height=66";
    soundCloud.creadListItem(url);
    //update localStorage
    localStorage.setItem("key",document.querySelector(".js-playlist").innerHTML);
};
soundCloud.creadCard=(id,imgsrc,address,name)=>{
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
    link.href=address;
    link.innerText=name;
    header.appendChild(link);
    contentContainer.appendChild(header);

    var bottom = document.createElement("div");
    bottom.addEventListener("click",function(){
        soundCloud.renderToList(id);
    })
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

soundCloud.search=(value)=>{
    //clean search result
    document.querySelector(".cards").innerHTML="";

    let songData=fetch(soundCloud.requestUrl+"/search?keywords="+value)
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
            soundCloud.creadCard(item.id,songImg,songUrl,songName);
        });
        
    });
}

