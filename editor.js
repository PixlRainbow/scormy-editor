class SimpleElement {
    tagName = "";
    id = "";
    classes = "";
    /** @type {[SimpleElement]} children*/
    children = [];
    text = "";
}

function start_editor(){
    /*
    var workingString = window.sessionStorage.getItem("workingData");
    if(!workingString){
        window.workingData = {
            slides: []
        };
    }else{
        window.workingData = JSON.parse(workingString);
    }
    console.dir(window.workingData);*/
    add_slide("Slide 1");
}
/**
 * 
 * @param {string} label label name
 */
function add_slide(label){
    /*
    var slide = {
        type: t,
        formIndex: formid,
        content: c,
        answer: correctAnswer
    };*/
    const tabs = document.querySelector('smart-tabs'); 
    tabs.insert(2,{"label":label});
    //window.workingData.slides.push(slide);
    //TODO: render slide. Use DOMParser for content
}