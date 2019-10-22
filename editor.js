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

    document.getElementsByClassName("demoTabs")[0].addEventListener("change", detect_new_slide);
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
    infoBtn.parentElement.contentEditable = "true";
    infoBtn.parentElement.innerHTML = "<p>Click here to edit text</p>"
    console.dir(infoBtn.parentElement);
}
function detect_new_slide(ev){
    if ("demoTabs" in ev.target.classList){
    var template = document.getElementById('new-slide');
    var clone = document.importNode(template.content, true);
    if(!select_slide(ev.detail.index).content){
        console.dir(clone);
        Array.from(clone.children).forEach((btn) => {
            select_slide(ev.detail.index).content += btn.outerHTML;
        });
    }
}
}

function add_radio_slide(qBtn,options) {
    var str= "";
    str += `<div class="draggable focus resizeToContent" draggable="true" ondragstart="dragstart(event)" ondragend="drag(event)">`
    str += `<form action="/action_page.php">
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
    ev.target.style.left =  ev.clientX -containerRect.left - data[0] + "px";
    ev.target.style.top = ev.clientY -containerRect.top - data[1]  + "px";
}
