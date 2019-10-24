function open_file_dialog(){
    document.querySelector("input[type=file]").click();
}
function load_file(ev){
    try {
        if(ev.target.files.length > 0){
            var jsonfile = ev.target.files[0];
            (new Response(jsonfile)).json().then((obj) => {
                console.dir(obj);
                //window.workingData = obj;
                window.sessionStorage.setItem('workingData', JSON.stringify(obj))
                alert("yay");
                location.href = "editor.html";
            }).catch((err) => {
                alert(err);
            });
        }
    } catch (error) {
        alert(error);
    }
}
function new_project(){
    window.sessionStorage.removeItem("workingData");
    location.href = "editor.html";
}
// function init(){
//     try {
//         document.querySelector("#content > input[type=file]").addEventListener("input", load_file);
//     } catch (error) {
//         alert(error);
//     }
// }