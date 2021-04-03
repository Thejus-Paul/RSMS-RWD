(function() {
	// To prevent re-injecting of the `content_script` 
	if (window.hasRun) {
		return;
	}
	window.hasRun = true;

	// To generate head tag and append its elements
	let head = document.createElement("head");
	let metadata = '<meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><title>RSMS RWD</title>';
	let style = '<style>*{box-sizing:border-box;margin:0;padding:0;border:0;outline:none}body{display:flex;justify-content:center;align-items:center;flex-direction:column;height:90vh;background-color:#fce38a}.login-box{display:flex;justify-content:center;align-items:center;flex-direction:column;padding:1rem;width:40vh;border-radius:10px}.login-box form{width:inherit}.login-box input{display:flex;justify-content:center;align-items:center;flex-direction:column;width:inherit;font-size:1rem;padding:1rem;border-radius:10px;font-weight:bold;text-align:center;letter-spacing:2px;background-color:#111;color:#fce38a;margin-top:1rem}.selection{display:flex;justify-content:center;align-items:center;flex-direction:row}.selection a{text-decoration:none}@media screen and (max-width: 800px){.selection{display:flex;justify-content:center;align-items:center;flex-direction:column;margin-bottom:1rem;margin-right:0rem}}.selection .selection__attendance,.selection .selection__marks{display:flex;justify-content:center;align-items:center;flex-direction:row;letter-spacing:2px;font-family:"Roboto Slab",sans-serif;font-weight:bold;padding:1rem;border:4px solid #111;margin-right:2.5rem;color:#111}@media screen and (max-width: 800px){.selection .selection__attendance,.selection .selection__marks{display:flex;justify-content:center;align-items:center;flex-direction:column;margin-bottom:1rem;margin-right:0rem}}.selection .selection__attendance:hover,.selection .selection__marks:hover{background-color:#fbd758}</style>';
	head.insertAdjacentHTML('afterbegin',(metadata+style));

	// To remove the pre-existing tags
	function removeExistingTags() {
		document.getElementsByTagName('html')[0].children.item(1).remove();
		document.getElementsByTagName('html')[0].children.item(0).remove();
		console.log("Removed Existing Tags!");
	}

	// To generate and return the leave data
	function generateLeaveData(tableElement) {
		let table = tableElement[3];
		let tdElements = table.getElementsByTagName('td');
		let subjects = {
			"IT402": "CCS",
			"IT404": "DA",
			"CS468": "CC",
			"MA484": "OR"
		};
		let leaveData = {};
		let date = "";
		for(let i = 8, length = tdElements.length; i < length; i++) {
			let item = tdElements[i].textContent;
			if(item != "") {
				if(item in subjects) {
					leaveData[date].push(subjects[item]);
				} else {
					date = item;
					leaveData[date] = [];
				}
			}
		}
		return leaveData;
	}

	// To calculate subject-wise leave count
	function subjectwiseLeaveCount(leaveData) {
		let subjectwiseLeaveCount = {
			"CCS": 0,
			"DA": 0,
			"CC": 0,
			"OR": 0
		};
		for(let leaveDate in leaveData) {
			for(let subject of leaveData[leaveDate]) {
				subjectwiseLeaveCount[subject]++;
			}
		}
		return(subjectwiseLeaveCount);
	}

	// To calculate the current attendance percentage and bunkable data
	function calcAttendanceDetails(leaveCount) {
		let totalClasses = {"CCS":6,"DA":6,"CC":6,"OR":6};
		for(let subject in totalClasses) {
			let percentage = (((totalClasses[subject] - leaveCount[subject]) / totalClasses[subject]) * 100).toFixed(3);
			let bunkable = Math.floor(((0.25*totalClasses[subject]) - leaveCount[subject])/0.75)
			console.log(subject,"Bunkable:",bunkable,"Percentage:",percentage);
		}
	}

	if(window.location.href == "https://www.rajagiritech.ac.in/stud/KTU/Parent/Leave.asp?code=2021S8IT") {
		let attendanceTable = document.getElementsByTagName('table');
		let leaveData = generateLeaveData(attendanceTable);
		if(Object.keys(leaveData).length === 0) {
			console.log("Full Attendance!");
		} else {
			let leaveCount = subjectwiseLeaveCount(leaveData);
			calcAttendanceDetails(leaveCount);
		}
		
		removeExistingTags();
	}
	else if(window.location.href == "https://www.rajagiritech.ac.in/stud/KTU/Parent/Home.asp") {
		removeExistingTags();

		document.getElementsByTagName('html')[0].append(head);

		// To generate body tag and append its elements
		let body = document.createElement("body");
		body.insertAdjacentHTML('afterbegin','<div class="selection"><a href="https://www.rajagiritech.ac.in/stud/KTU/Parent/Leave.asp?code=2021S8IT"><div class="selection__attendance"><img src="https://img.icons8.com/dotty/128/attendance-mark.png" alt="Attendance icon" loading="lazy"><span>ATTENDANCE</span></div></a><a href="https://www.rajagiritech.ac.in/stud/KTU/Parent/Mark.asp"><div class="selection__marks"><img src="https://img.icons8.com/dotty/128/grades.png" alt="Grades icon" loading="lazy"><span>MARKS</span></div></a></div>');
		document.getElementsByTagName('html')[0].append(body);
	}
	else if(window.location.href == "https://www.rajagiritech.ac.in/stud/parent/") {
		removeExistingTags();

		document.getElementsByTagName('html')[0].append(head);

		// To generate body tag and append its elements
		let body = document.createElement("body");
		body.insertAdjacentHTML('afterbegin','<div class="login-box"><img src="https://raw.githubusercontent.com/Thejus-Paul/RSMS-RWD/main/icons/RSMS-RWD.svg" alt="RSMS RWD Icon" width="150px"/><form method="POST" action="https://www.rajagiritech.ac.in/stud/parent/varify.asp"><input type="text" placeholder="UID" name="user"><input type="password" placeholder="Password" name="pass"><input type="submit" value="LOGIN"></form></div>');
		document.getElementsByTagName('html')[0].append(body);
	}
	
})();
