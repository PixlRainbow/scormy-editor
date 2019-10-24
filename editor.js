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
        //TODO: switch ev.detail.index to index after merge
        document.querySelector(`div.smart-tab-label-container:nth-child(${ev.detail.index+1})`)
            .addEventListener("dblclick", (clkEv) => {
                let oldName = select_slide(ev.detail.index).label;
                let newName = prompt("New Slide Name", oldName) || oldName;
                //elem.textContent = newName;
                document.getElementById("horizontalTabs1").update(ev.detail.index, newName);
            });
    }
}