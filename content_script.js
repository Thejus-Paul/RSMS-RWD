(function() {
	// To prevent re-injecting of the `content_script` 
	if (window.hasRun) {
		return;
	}
	window.hasRun = true;
	if(window.location.href == "https://www.rajagiritech.ac.in/stud/parent/"){
		document.getElementsByTagName('html')[0].children.item(1).remove();
		document.getElementsByTagName('html')[0].children.item(0).remove();
		console.log("Removed Existing Tags!");
	}
	
})();
