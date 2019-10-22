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
    var tabs = document.getElementById("horizontalTabs1");
    var workingString = window.sessionStorage.getItem("workingData");
    if(!workingString){
        window.workingData = {
            slides: []
        };
    }else{
        window.workingData = JSON.parse(workingString);
    }
    console.dir(window.workingData);
    tabs.addEventListener('reorder',
        (ev) => {console.dir(ev)}
    );
    tabs.addEventListener("change", detect_new_slide);
    //repeated code -- TODO factorize
    var template = document.getElementById('new-slide');
    var clone = document.importNode(template.content, true);
    select_slide(0).appendChild(clone);
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
    var index = ev.detail.index;
    if(!select_slide(index).content){
        console.dir(clone);
        Array.from(clone.children).forEach((btn) => {
            select_slide(index).content += btn.outerHTML;
        });
    }
}
function save_slides(){
    Array.from(document.querySelectorAll('smart-tab-item > div.smart-container > .ql-container')).forEach((elem) => {
        var slideContent = "";
        //TODO: add "or" to selector query string, to handle question slides
        if(elem.id.startsWith("editor")){
            //the word "editor" is 6 characters long. Substr gets the number at the end.
            var textEditor = infoEditors[elem.id.substr(6) - 1];
            slideContent = textEditor.getContents();
        }
        add_slide("info", slideContent);
    });
    var blob = new Blob([JSON.stringify(window.workingData)], {type: "application/json;charset=utf-8"});
    saveAs(blob, "quiz.json");
}