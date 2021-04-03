(function() {
	// To prevent re-injecting of the `content_script` 
	if (window.hasRun) {
		return;
	}
	window.hasRun = true;

	// To generate head tag and append its elements
	let head = document.createElement("head");
	let metadata = '<meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><title>RSMS RWD</title>';
	let style = '<style>*{box-sizing:border-box;margin:0;padding:0;border:0;outline:none}body{display:flex;justify-content:center;align-items:center;flex-direction:column;height:90vh;background-color:#fce38a}.login-box{display:flex;justify-content:center;align-items:center;flex-direction:column;padding:1rem;width:40vh;border-radius:10px}.login-box form{width:inherit}.login-box input{display:flex;justify-content:center;align-items:center;flex-direction:column;width:inherit;font-size:1rem;padding:1rem;border-radius:10px;font-weight:bold;text-align:center;letter-spacing:2px;background-color:#111;color:#fce38a;margin-top:1rem}.selection{display:flex;justify-content:center;align-items:center;flex-direction:row}.selection a{text-decoration:none}@media screen and (max-width: 800px){.selection{display:flex;justify-content:center;align-items:center;flex-direction:column;margin-bottom:1rem;margin-right:0rem}}.selection .selection__attendance,.selection .selection__marks{display:flex;justify-content:center;align-items:center;flex-direction:row;letter-spacing:2px;font-family:"Roboto Slab",sans-serif;font-weight:bold;padding:1rem;border:4px solid #111;margin-right:2.5rem;color:#111}@media screen and (max-width: 800px){.selection .selection__attendance,.selection .selection__marks{display:flex;justify-content:center;align-items:center;flex-direction:column;margin-bottom:1rem;margin-right:0rem}}.selection .selection__attendance:hover,.selection .selection__marks:hover{background-color:#fbd758}.nav{display:flex;justify-content:flex-end;align-items:flex-end;flex-direction:column;width:90%}.nav a{display:flex;justify-content:center;align-items:center;padding:1rem;margin-left:.5rem;color:#111;font-family:"Roboto Slab",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif;text-decoration:none}.attendance{display:flex;justify-content:center;align-items:center;flex-direction:row;flex-wrap:wrap}.subjects{display:flex;justify-content:center;align-items:center;flex-direction:row;flex-wrap:wrap;padding:1rem;margin:.5rem !important;border:4px solid #111}@media screen and (max-width: 800px){.subjects{display:flex;justify-content:center;align-items:center;flex-direction:column;margin-bottom:1rem;margin-right:0rem}}.subjects span{font-family:"Roboto Slab",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif;margin-right:.5rem;font-size:1.25rem}.subjects .subjects__name{font-weight:bold}.leave{display:flex;justify-content:center;align-items:center;flex-direction:column;flex-wrap:wrap;margin:1rem;font-family:"Roboto Slab",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif}/*# sourceMappingURL=main.min.css.map */</style>';
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

	// To calculate and display the current attendance percentage and bunkable data
	function calcAttendanceDetails(leaveCount) {
		let totalClasses = {"CCS":6,"DA":6,"CC":6,"OR":6};

		let attendanceElement = document.getElementsByClassName("attendance")[0];

		for(let subject in totalClasses) {
			let subjects = document.createElement("div");
			subjects.setAttribute("class","subjects");

			let subjectName = document.createElement("span");
			subjectName.setAttribute("class","subjects__name");
			subjectName.textContent = subject;

			let subjectPercentage = document.createElement("span");
			let percentage = (((totalClasses[subject] - leaveCount[subject]) / totalClasses[subject]) * 100).toFixed(2);
			percentage = percentage == 100.00 ? "100.0%" : (percentage + "%");
			subjectPercentage.textContent = percentage;

			let subjectBunkable = document.createElement("span");
			let bunkable = Math.floor(((0.25*totalClasses[subject]) - leaveCount[subject])/0.75);
			subjectBunkable.textContent = bunkable;
			
			subjects.appendChild(subjectName);
			subjects.appendChild(subjectPercentage);
			subjects.appendChild(subjectBunkable);
			attendanceElement.appendChild(subjects);
		}
	}

	// To display the leave data
	function displayLeaveData(leaveData) {
		let leave = document.getElementsByClassName('leave')[0];
		let table = document.createElement('table');
		for(let leaveDate in leaveData) {
			let tr = document.createElement('tr');

			let th = document.createElement('th');
			th.textContent = leaveDate.split('-2021')[0].replace('-',' ') + " : ";
			let td = document.createElement('td');

			let subjects = "";
			for(let subject of leaveData[leaveDate]) subjects += (subject+", ");
			subjects = subjects.slice(0,-2);
			td.textContent = subjects;

			tr.appendChild(th);
			tr.appendChild(td);
			table.appendChild(tr);
		}
		leave.appendChild(table);
	}

	if(window.location.href == "https://www.rajagiritech.ac.in/stud/KTU/Parent/Leave.asp?code=2021S8IT") {
		let attendanceTable = document.getElementsByTagName('table');
		let leaveData = generateLeaveData(attendanceTable);
		
		removeExistingTags();

		document.getElementsByTagName('html')[0].append(head);

		// To generate body tag and append its elements
		let body = document.createElement("body");
		body.insertAdjacentHTML('afterbegin','<div class="nav"><a href="https://www.rajagiritech.ac.in/stud/KTU/Parent/Logout.asp"> LOGOUT &nbsp;<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg> </a></div><div class="attendance"></div><div class="leave"></div>');
		document.getElementsByTagName('html')[0].append(body);
		
		let leaveCount = subjectwiseLeaveCount(leaveData);
		calcAttendanceDetails(leaveCount);

		displayLeaveData(leaveData);
	}
	else if(window.location.href == "https://www.rajagiritech.ac.in/stud/KTU/Parent/Home.asp") {
		removeExistingTags();

		document.getElementsByTagName('html')[0].append(head);

		// To generate body tag and append its elements
		let body = document.createElement("body");
		body.insertAdjacentHTML('afterbegin','<div class="selection"><a href="https://www.rajagiritech.ac.in/stud/KTU/Parent/Leave.asp?code=2021S8IT"><div class="selection__attendance"><img src="https://img.icons8.com/dotty/128/attendance-mark.png" alt="Attendance icon" loading="lazy"><span>ATTENDANCE</span></div></a><a href="https://www.rajagiritech.ac.in/stud/KTU/Parent/Mark.asp"><div class="selection__marks"><img src="https://img.icons8.com/dotty/128/grades.png" alt="Grades icon" loading="lazy"><span>MARKS</span></div></a></div>');
		document.getElementsByTagName('html')[0].append(body);
	}
	else if(window.location.href == "https://www.rajagiritech.ac.in/stud/parent/" ||window.location.href == "https://www.rajagiritech.ac.in/stud/Parent/Index.asp?stat=logout") {
		removeExistingTags();

		document.getElementsByTagName('html')[0].append(head);

		// To generate body tag and append its elements
		let body = document.createElement("body");
		body.insertAdjacentHTML('afterbegin','<div class="login-box"><img src="https://raw.githubusercontent.com/Thejus-Paul/RSMS-RWD/main/icons/RSMS-RWD.svg" alt="RSMS RWD Icon" width="150px"/><form method="POST" action="https://www.rajagiritech.ac.in/stud/parent/varify.asp"><input type="text" placeholder="UID" name="user"><input type="password" placeholder="Password" name="pass"><input type="submit" value="LOGIN"></form></div>');
		document.getElementsByTagName('html')[0].append(body);
	}
	
})();
