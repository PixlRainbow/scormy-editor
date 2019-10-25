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
    let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if(isMobile)
        CKEDITOR.config.height = "calc(50vh - 6em)";
    else
        CKEDITOR.config.height = "calc(50vh - 3em)";

    var tabs = document.getElementById("horizontalTabs1");
    var workingString = window.sessionStorage.getItem("workingData");
    if(!workingString){
        window.workingData = {
            slides: []
        };
        //repeated code -- TODO factorize
        var template = document.getElementById('new-slide');
        var clone = document.importNode(template.content, true);
        select_slide(0).appendChild(clone);
        enable_rename(0);
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
                enable_rename(i);
                if(thisSlide.type === "info"){
                    add_info_editor();
                    //infoEditors[i].setContents(thisSlide.content);
                    infoEditors[i].setData(thisSlide.content);
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
    clone.firstElementChild.name += lastInfoPage.toString();
    var infoBox = infoBtn.parentElement;
    infoBox.innerHTML = "";
    infoBox.appendChild(clone);
    infoBox.style.padding = "0";
    add_info_editor();
}
function add_info_editor(){
    infoEditors.push(CKEDITOR.replace(`editor${lastInfoPage++}`));
    // infoEditors.push(
    //     new Quill(`#editor${lastInfoPage++}`, {
    //         modules: {
    //             toolbar: [
    //                 [{ header: [1, 2, false] }],
    //                 ['bold', 'italic', 'underline'],
    //                 ['image', 'code-block', 'blockquote'],
    //                 [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    //                 [{ 'indent': '-1'}, { 'indent': '+1' }],
    //                 [{ 'color': [] }, { 'background': [] }],
    //                 [{ 'font': [] }],
    //                 [{ 'align': [] }],
    //                 ['clean'] //'remove formatting' button
    //             ]
    //         },
    //         placeholder: 'Click here to edit text',
    //         theme: 'snow'
    //     })
    // );
}
/**
 * adds double click event listener to tab label for rename prompt
 * @param {number} slide_index starts from zero not one
 */
function enable_rename(slide_index) {
    document.querySelector(`div.smart-tab-label-container:nth-child(${slide_index+1})`)
        .addEventListener("dblclick", (clkEv) => {
            let oldName = select_slide(slide_index).label;
            let newName = prompt("New Slide Name", oldName) || oldName;
            //elem.textContent = newName;
            document.getElementById("horizontalTabs1").update(slide_index, newName);
        });
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
        enable_rename(index);
    }
}
function save_slides(){
    Array.from(document.querySelectorAll('textarea.info_editor')).forEach((elem) => {
        var slideContent = "";
        //TODO: add "or" to selector query string, to handle question slides
        if(elem.id.startsWith("editor")){
            //the word "editor" is 6 characters long. Substr gets the number at the end.
            var textEditor = infoEditors[elem.id.substr(6) - 1];
            //slideContent = textEditor.getContents();
            slideContent = textEditor.getData();
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