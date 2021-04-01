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

		// To generate head tag and append its elements
		let head = document.createElement("head");
		head.insertAdjacentHTML('afterbegin','<meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>*{box-sizing:border-box;margin:0;padding:0;border:0;outline:none}body{display:flex;justify-content:center;align-items:center;flex-direction:column;height:90vh;background-color:#fce38a}.login-box{display:flex;justify-content:center;align-items:center;flex-direction:column;padding:1rem;width:40vh;border-radius:10px}.login-box form{width:inherit}.login-box input{display:flex;justify-content:center;align-items:center;flex-direction:column;width:inherit;font-size:1rem;padding:1rem;border-radius:10px;font-weight:bold;text-align:center;letter-spacing:2px;background-color:#111;color:#fce38a;margin-top:1rem}</style><title>RSMS RWD</title>');
		document.getElementsByTagName('html')[0].append(head);

		// To generate body tag and append its elements
		let body = document.createElement("body");
		body.insertAdjacentHTML('afterbegin','<div class="login-box"><img src="https://raw.githubusercontent.com/Thejus-Paul/RSMS-RWD/main/icons/RSMS-RWD.svg" alt="RSMS RWD Icon" width="150px"/><form method="POST" action="https://www.rajagiritech.ac.in/stud/parent/varify.asp"><input type="text" placeholder="UID" name="user"><input type="password" placeholder="Password" name="pass"><input type="submit" value="LOGIN"></form></div>');
		document.getElementsByTagName('html')[0].append(body);
	}
	
})();
