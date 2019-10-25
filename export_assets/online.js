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
}