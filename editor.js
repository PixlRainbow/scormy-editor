var lastInfoPage = 1;
var infoEditors = [];

class SimpleElement {
    tagName = "";
    id = "";
    classes = "";
    /** @type {[SimpleElement]} children*/
    children = [];
    text = "";
}
function start_editor(){
    var workingString = window.sessionStorage.getItem("workingData");
    if(!workingString){
        window.workingData = {
            slides: []
        };
    }else{
        window.workingData = JSON.parse(workingString);
    }
    console.dir(window.workingData);
    document.getElementById("horizontalTabs1").addEventListener('reorder',
        (ev) => {console.dir(ev)}
    );
    //repeated code -- TODO factorize
    var template = document.getElementById('new-slide');
    var clone = document.importNode(template.content, true);
    select_slide(0).appendChild(clone);

    //document.getElementsByClassName("demoTabs")[0].addEventListener("change", detect_new_slide);
}
function select_slide(i){
    return document.querySelectorAll("smart-tabs smart-tab-item")[i];
}
/**
 * 
 * @param {string} t qn or info
 * @param {[SimpleElement]} c HTML content of slide
 * @param {number} formid index of form in document. Null if not a question.
 * @param {[number]} correctAnswer index position for correct answer. More than one value if checkbox. Empty if not a question.
 */
function add_slide(t, c = [], formid = null, correctAnswer = []){
    var slide = {
        type: t,
        formIndex: formid,
        content: c,
        answer: correctAnswer
    };
    window.workingData.slides.push(slide);
    //TODO: render slide. Use DOMParser for content
}
/**
 * 
 * @param {Element} infoBtn 
 */
function add_info_slide(infoBtn) {
    //infoBtn.parentElement.contentEditable = "true";
    //infoBtn.parentElement.innerHTML = "<p>Click here to edit text</p>"
    var template = document.getElementById('new-info-slide');
    var clone = document.importNode(template.content, true);
    clone.firstElementChild.id += lastInfoPage.toString();
    var infoBox = infoBtn.parentElement;
    infoBox.innerHTML = "";
    infoBox.appendChild(clone);
    infoBox.style.padding = "0";
}
function detect_new_slide(ev){
    var template = document.getElementById('new-slide');
    var clone = document.importNode(template.content, true);
    if(!select_slide(ev.detail.index).content){
        console.dir(clone);
        Array.from(clone.children).forEach((btn) => {
            select_slide(ev.detail.index).content += btn.outerHTML;
        });
    }

}

function add_radio_slide(qBtn,options) {
    var str= "";

    //to be shifted into general question slide 
    str += `<qnaSlide answered="false"> </qnaSlide>`

    str += `<div class="draggable focus resizeToContent" draggable="true" ondragstart="dragstart(event)" ondragend="drag(event)" onfocusin="toolbarAppear(this)"
    onfocusout="toolbarHide(this)">`
    str += `<form action="/action_page.php" onchange="event.stopPropagation();">
    <p class="resizeToContent" contentEditable="true">Please select your gender:</p><br />`;
    console.dir(qBtn.parentElement);
    var currOptionNum = 1;
    do{
        str += `<input type="radio" id="`+currOptionNum+`" name="radAnswer" value="Option` + currOptionNum +`"> <label class="optionLabel" contentEditable="true" placeholder="Enter something here..."`+
        `">Option` + currOptionNum + `</label><br>`
        currOptionNum += 1;
    }while(currOptionNum < options);
    str += `</form></div>`;
    qBtn.parentElement.innerHTML = str;
    

}
function dragstart(ev){
    
    ev.target.parentElement.addEventListener("drop",allowDrop);
    ev.target.parentElement.addEventListener("dragover",allowDrop);
    ev.target.parentElement.addEventListener("dragover",allowDrop);
    
    var rect = ev.target.getBoundingClientRect();
    //ev.dataTransfer.setData("text", rect.left + "," + rect.top); //cannot be read in events other than dragstart and drop because protected mode
    localStorage.setItem("rectPos",(ev.clientX - rect.left)+","+(ev.clientY - rect.top));

    ev.target.classList.add("being-dragged");
}
function allowDrop(ev){
    ev.preventDefault();
}
function drag(ev){
    ev.preventDefault();
    ev.target.classList.remove("being-dragged");
    var containerRect = ev.target.parentElement.getBoundingClientRect();
    var data = localStorage.getItem("rectPos").split(",");
    
    ev.target.style.position = "absolute";
    var newX = ev.clientX -containerRect.left - data[0];
    var newY = ev.clientY -containerRect.top - data[1];

    var rect = ev.target.getBoundingClientRect();

    //containerRect.width and .height to be replaced with screensize width and height

    if (newX + rect.width > containerRect.width) newX = containerRect.width-rect.width;
    else if (newX < 0) {newX = 0;}

    if (newY + rect.height > containerRect.height) newY = containerRect.height-rect.height;
    else if (newY < 0) {newY = 0;}

    ev.target.style.left =  newX + "px";
    ev.target.style.top = newY  + "px";

    
}

function toolbarAppear(div){
    /*
    console.log("div has been focused!");
    var menu = document.getElementById("menu");
    
    console.dir(div);
    menu.style.top = div.style.top;
    //console.log(menu.style.top);
    menu.style.top = parseInt(menu.style.top) - 5 + "px";
    menu.style.left = div.style.left; 
    menu.style.left = parseInt(menu.style.left) + 5 + "px";
    menu.style.visibility = 'visible';
    //ev.target
    */
}
function toolbarHide(ev){
    /*
    var menu = document.getElementById("menu");
    menu.style.visibility = 'hidden';*/
}

function nextSlide(btn){
    const tabs = document.querySelector('smart-tabs');
    let selectedIndex = tabs.selectedIndex;
    if (selectedIndex < tabs.getElementsByTagName("smart-tab-item").length -1) tabs.selectedIndex+=1;
    btn.disabled = true;
    let tab = tabs.getElementsByTagName("smart-tab-item")[tabs.selectedIndex];
    if (!(tab.getElementsByTagName("qnaSlide").length && tab.getElementsByTagName("qnaSlide")[0].getAttribute("answered") == "false")) btn.disabled = false;
}

function prevSlide(){
    const tabs = document.querySelector('smart-tabs');
    let selectedIndex = tabs.selectedIndex;
    if (selectedIndex > 0) tabs.selectedIndex-=1;
    let tab = tabs.getElementsByTagName("smart-tab-item")[tabs.selectedIndex];
    if (!(tab.getElementsByTagName("qnaSlide").length)) document.getElementById("nextBtn").disabled = false;
}