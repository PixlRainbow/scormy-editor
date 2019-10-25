function start_viewer(){
    var tabs = document.getElementById("horizontalTabs1");

    fetch("quiz.json")
        .then(function(res){
            if(res.status === 200){
                return res.json();
            }
            else{
                var error = new Error(res.statusText);
                error.response = res;
                throw error;
            }
        })
        .then(function(workingData){
            for(let i = 0; i < workingData.slides.length; i++){
                let thisSlide = workingData.slides[i];
                console.log(thisSlide.content);
                tabs.insert(i, {
                    "label": thisSlide.name,
                    "content": thisSlide.content
                });
            }
        })
        .catch(function(err){
            alert(err);
        });
    strip_question(document);
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