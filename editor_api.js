class init {
    
constructor(){
    this.options = document.createElement("div");
    this.backSmartBtn = document.createElement("smart-button");
    this.backBtn = document.createElement("button");
    this.backBtn.innerText = "back";
    this.backSmartBtn.append(this.backBtn);
    this.options.append(this.backSmartBtn);

    this.nextSmartBtn = document.createElement("smart-button");
    this.nextBtn = document.createElement("button");
    this.nextBtn.innerText = "next";
    this.nextSmartBtn.append(this.nextBtn);
    this.options.append(this.nextSmartBtn);

    document.body.append(this.options);
    this.options.style.alignSelf = "center";
    this.toggleButtonVisibility();
    //this.options.hidden = "true";
    //document.body.style.textAlign = "center";
}

toggleButtonVisibility(){
    //var visibility = {"true" : "false", "false" : "true"};
    this.options.hidden = !this.options.hidden;

}



}