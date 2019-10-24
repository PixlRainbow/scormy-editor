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
        try {
            tabs.remove(0);
            window.workingData = JSON.parse(workingString);

            for(let i = 0; i < window.workingData.slides.length; i++){
                let thisSlide = window.workingData.slides[i];
                let content = "";
                if(thisSlide.type === "info"){
                    let template = document.getElementById('new-info-slide');
                    let clone = document.importNode(template.content, true);
                    clone.firstElementChild.id += lastInfoPage.toString();
                    Array.from(clone.children).forEach((elem) => {
                        content += elem.outerHTML;
                    });
                }else{
                    content = "<p>some q shit</p>"
                }
                console.log(content);
                tabs.insert(i, {
                    "label": `Slide ${i + 1}`,
                    "content": content
                });
                if(thisSlide.type === "info"){
                    add_info_editor();
                    infoEditors[i].setContents(thisSlide.content);
                }
            }
        } catch (error) {
            alert(error);
        }
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
    add_info_editor();
}
function add_info_editor(){
    infoEditors.push(
        new Quill(`#editor${lastInfoPage++}`, {
            modules: {
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline'],
                    ['image', 'code-block', 'blockquote'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'indent': '-1'}, { 'indent': '+1' }],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'font': [] }],
                    [{ 'align': [] }],
                    ['clean'] //'remove formatting' button
                ]
            },
            placeholder: 'Click here to edit text',
            theme: 'snow'
        })
    );
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


//Todo: change parameters to query user instead
function add_question_slide(qBtn,options){
    var str= "";

    //to be shifted into general question slide 
    str += `<qnaSlide answered="false"> </qnaSlide>`;
    var parentDiv = qBtn.parentElement;
    parentDiv.innerHTML = str;
    add_radio_slide(parentDiv,options)
}


function add_radio_slide(parentDiv,options) {
    var str= "";

    //to be shifted into general question slide 
    //str += `<qnaSlide answered="false"> </qnaSlide>`

    str += `<div class="draggable focus resizeToContent question" draggable="true" ondragstart="dragstart(event)" ondragend="drag(event)" onfocusin="toolbarAppear(this)"
    onfocusout="toolbarHide(this)">`
    str += `<form action="/action_page.php" 
    onchange="event.stopPropagation();" 
    ondragstart="event.stopPropagation();" 
    ondragend="event.stopPropagation();">
    <p class="resizeToContent" contentEditable="true">Please select your gender:</p><br />`;
    //console.dir(parentDiv);
    var currOptionNum = 1;
    do{
        str += `<input type="radio" id="`+currOptionNum+`" name="radAnswer" value="` + currOptionNum +`"> <label class="optionLabel" contentEditable="true" placeholder="Enter something here..."`+
        `">Option` + currOptionNum + `</label><br>`
        currOptionNum += 1;
    }while(currOptionNum < options);
    str += `</form></div>`;
    parentDiv.innerHTML += str;
    

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
    
    //var docActive = document.activeElement;
    //console.log(docActive);
    //console.log("div has been focused!");
    window.getSelection().removeAllRanges();
    var user_selection = document.querySelector('#user_selection');
    var innerSpan = document.getElementById("fontSetter");
   //user_selection.setAttribute("id","old_selection")
    if(user_selection){
        //selectText(user_selection);
        //user_selection.removeAttribute("id");
        innerSpan.removeAttribute("id");
        user_selection.outerHTML = user_selection.innerHTML;
        //selectText(user_selection);
    }

    var menu = document.getElementById("menu");
    
    //console.dir(div);
    menu.style.top = div.style.top;
    //console.log(menu.style.top);
    menu.style.top = parseInt(menu.style.top) - 5 + "px";
    menu.style.left = div.style.left; 
    menu.style.left = parseInt(menu.style.left) + 5 + "px";
    menu.style.visibility = 'visible';
    //ev.target
    
}
function toolbarHide(div){
    /*
    //console.log(window.getSelection());
    if (window.getSelection()){
        wrapSelectedText(div);
    }
    //console.log("form visibility");

    //now checked for which element is focused
    var focused = document.activeElement;
    console.log(focused);
    //console.log(docActive);
    //console.log(div.querySelectorAll("form :focus").length === 0);
    //console.log(document.getElementById("menu").querySelectorAll("smart-menu :focus").length);
    if ((!focused || focused == document.body)){
        var menu = document.getElementById("menu");
        if (!(menu.contains(document.activeElement))) menu.style.visibility = 'hidden';
    }
    
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
    //if (!(tab.getElementsByTagName("qnaSlide").length)) 
    document.getElementById("nextBtn").disabled = false;
}

function fontSizeChange(inputBox){
    //console.log("changed");
    var user_selection = document.getElementById("user_selection");
    var innerSpan = document.getElementById("fontSetter");
    if (user_selection) {
        innerSpan.style.fontSize = inputBox.value + "px";
        //check how many old spans are inside (to be removed)
        if (user_selection.querySelectorAll("span").length > 1){
            //console.log("got more than one");
            //console.dir(user_selection.querySelectorAll("span"));
            /*
            var selections = user_selection.querySelectorAll("span");
            for (i = 1; i < selections.length; i++){ 
                var elem = selections[i];
                console.log(i);
                console.log(elem);
                elem.outerHTML = elem.innerHTML;
            }*/
            // remove/replace all inner spans that changes font size
            while(user_selection.querySelectorAll("span").length > 1){
                var elem = user_selection.querySelectorAll("span")[1];
                //console.log(elem);
                elem.outerHTML = elem.innerHTML;
            }
            
        }
        //check if parent element is another old span
        var parent = user_selection.parentElement;
        //console.console.log(parent);
        //console.log(user_selection.parentElement.childElementCount);
        //console.log(user_selection.parentElement.nodeType);
        for (let elem in parent.querySelectorAll("span")){
            cleaner(elem);
        }
        if (user_selection.parentElement.childElementCount === 1 && user_selection.parentElement.tagName === "SPAN") user_selection.parentElement.outerHTML = user_selection.parentElement.innerHTML; 
        /*
        if (user_selection.getElementsByTagName('span').length){
            for (var i in user_selection.getElementsByTagName('span')){ 
                user_selection.outerHTML += i;
                user_selection.remove(i);
            }
        }
        */
    }
}

function wrapSelectedText(parent) {       
    var selection= window.getSelection().getRangeAt(0);
    console.log(selection.parentElement);
    var selectedText = selection.extractContents();
    var span= document.createElement("span");
    span.setAttribute("id","user_selection");
    span.style.backgroundColor = "grey";
    var innerSpan = document.createElement("span");
    innerSpan.id = "fontSetter";
    innerSpan.appendChild(selectedText);
    span.appendChild(innerSpan);
    selection.insertNode(span);
}

function selectText(node) {

    if (document.body.createTextRange) {
        const range = document.body.createTextRange();
        range.moveToElementText(node);
        range.select();
    } else if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        console.warn("Could not select text in node: Unsupported browser.");
    }
}

//clean up empty tags
function cleaner(el) {
        if (el.innerHTML == '&nbsp;' || el.innerHTML == '') {
            el.parentNode.removeChild(el);
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
function generate_manifest(someListOfAssets){
    var req = new XMLHttpRequest();
    //var manifest;
    var xmlStringPromise = new Promise((resolve, reject) => {
        req.onreadystatechange = () => {
            if(req.readyState == 4 && req.status == 200){
                let manifest = req.responseXML;
                let resourceTag = manifest.querySelector('resource[identifier=r1]');
                someListOfAssets.forEach((filename) => {
                    let fileTag = manifest.createElement("file");
                    fileTag.setAttribute("href", filename);
                    resourceTag.appendChild(fileTag);
                });
                let serializer = new XMLSerializer();
                let manifestStr = serializer.serializeToString(manifest);
                resolve(manifestStr);
            }
        };
        req.open("GET","export_assets/imsmanifest.xml", true);
        req.send();
    });
    return xmlStringPromise;
}
/**
 * 
 * @param {Array} dirStruct 
 * @param {JSZip} zipfile
 */
function generate_zip(dirStruct, zipfile = null, parent = ""){
    var curZip;
    if(!zipfile) {
        curZip = new JSZip();
    }else{
        curZip = zipfile;
    }
    dirStruct.forEach((entry) => {
        if(entry.type == "dir"){
            generate_zip(entry.content, curZip, parent+`/${entry.name}`);
        }else{
            curZip.file(parent+`/${entry.name}`, entry.content);
        }
    });
    if(!zipfile){
        return curZip.generateAsync({type:"blob"});
    }
}
function export_SCORM(){
    //
}
