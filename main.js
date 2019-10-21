function open_file_dialog(){
    document.querySelector("#content > input[type=file]").click();
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
            }).catch((err) => {
                alert(err);
            });
        }
    } catch (error) {
        alert(error);
    }
}
// function init(){
//     try {
//         document.querySelector("#content > input[type=file]").addEventListener("input", load_file);
//     } catch (error) {
//         alert(error);
//     }
// }