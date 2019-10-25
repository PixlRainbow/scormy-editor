var lastInfoPage = 1;
var infoEditors = [];

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
    }else{
        try {
            tabs.remove(0);
            window.workingData = JSON.parse(workingString);

            for(let i = 0; i < window.workingData.slides.length; i++){
                let thisSlide = window.workingData.slides[i];
                console.dir(thisSlide);
                let content = "";
                if(thisSlide.type === "info"){
                    let template = document.getElementById('new-info-slide');
                    let clone = document.importNode(template.content, true);
                    clone.firstElementChild.id += lastInfoPage.toString();
                    Array.from(clone.children).forEach((elem) => {
                        content += elem.outerHTML;
                    });
                }
                else if (thisSlide.type==="qn"){
                    console.log("thisSlide.content")
                    console.dir(thisSlide.content);
                    content = thisSlide.content;
                }
                else{
                    content = "<p>some q shit</p>"
                }
                console.log(content);
                tabs.insert(i, {
                    "label": thisSlide.name,
                    "content": content
                });
                //enable_rename(i);
                if(thisSlide.type === "info"){
                    //add_info_editor();
                    //infoEditors[infoEditors.length - 1].setData(thisSlide.content);
                }
            }
        } catch (error) {
            alert(error);
            console.dir(error);
        }
    }
    console.dir(window.workingData);
    tabs.addEventListener('reorder',
        (ev) => {console.dir(ev)}
    );
    strip_question(document);
}

function select_slide(i){
    return document.querySelectorAll("smart-tabs smart-tab-item")[i];
}

function add_info_editor(){
    infoEditors.push(CKEDITOR.replace(`editor${lastInfoPage++}`));
}

function strip_question(doc){
    for (const d of doc.getElementsByClassName("draggable")){
        d.removeAttribute("draggable");
        d.removeAttribute("ondragstart");
        d.removeAttribute("ondragend");
        d.removeAttribute("onfocusin");
        d.removeAttribute("onfocusout");

    }
    for (const i of doc.forms){
        i.removeAttribute("onmousedown");
        i.removeAttribute("onmouseup");
        i.removeAttribute("onkeydown");
    }
    while (doc.querySelector("[contentEditable='true']")){
        doc.querySelector("[contentEditable='true']").removeAttribute("contentEditable");
    }
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

function onSubmit(){
    var smartTabs = document.getElementById("horizontalTabs1");
    var selectedIndex = smartTabs.getAttribute("selected-index");
    var currTab = smartTabs.querySelector('smart-tab-item[index="'+selectedIndex+'"]');
    var forms = currTab.getElementsByTagName("form");
    var numCorrect = 0;
    var numAnswered = 0;
    if (forms){
        console.dir(forms);
        for (const i of forms){
            console.dir(i)
            if (i.classList.contains("radioForm")){
                for (const b of i.querySelectorAll("input"))
                    if (b.checked){
                        console.log("b checked");
                        if (btoa(btoa(btoa(b.value))) != i.getAttribute("answer")){
                            alert("Wrong answer for '"+i.getElementsByTagName("p")[0].innerText+"'!")
                            numAnswered ++;
                        }
                        else {
                            alert("Correct!");
                            numCorrect++;
                        }
                        //i.setAttribute("answer",btoa(btoa(btoa(b.value))));
                        console.log(i.getAttribute("answer"))
                    }
            }
        }
        if (!(numCorrect < forms.length)){
            currTab.getElementsByTagName("qnaSlide")[0].setAttribute("answered","true");
            document.getElementById("nextBtn").disabled = false;
        }
        else{
            if (numAnswered < forms.length) alert("Please answer all the questions");
        }
    }
}