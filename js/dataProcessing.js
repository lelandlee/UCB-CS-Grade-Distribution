var data = []
var process_data_F15 = [];
var process_data_S14 = [];
var process_data_Sum14 = [];
var current_process_data = []

//why is it empty
loadData("Grade_Distribution_Fall_2014.csv", process_data_F15, 651);
loadData("Grade_Distribution_Spring_2015.csv", process_data_S14, 651);
loadData("Grade_Distribution_Sum_2014.csv", process_data_Sum14, 151);

function loadData(fileName, dataPointer, end){
	d3.csv("data/" + fileName, function(d){
		//can group here rather than afterwards, more efficient
	  data.push({
	    ccn: d['Course Control Nbr'],
	    instructorName: d['Instructor Name'],
	    courseNumber: d['Course Number'],
	    courseName: d['Course Title Nm'],
	    grade: d['Grade Nm'],
	    size: d['Enrollment Cnt']
	  })
	  if(data.length == end){
	    console.log(data);
	    dataPointer = process(data);
	    data = []
	  }
	}, function(error, rows) {
		console.log(error);
		console.log(rows);
	});
}

function process(data){
	var process_data = {}
	var current_ccn = data[0].ccn;
	var transfer_information = []
	var total = 0;
	for(d in data){
		if(data[d].ccn == current_ccn){
			transfer_information.push({
				grade: data[d].grade,
				size: data[d].size
			})
			total += +data[d].size;
		}
		else{
			process_data[current_ccn] = {
				distribution:transfer_information,
				data: {
					instructorName: data[d - 1].instructorName,
					courseNumber: data[d - 1].courseNumber,
					courseName: data[d - 1].courseName
				},
				total: total
			};
			current_ccn = data[d].ccn;
			transfer_information = [];
			//need to add the first instance again
			transfer_information.push({
				grade: data[d].grade,
				size: data[d].size
			});
			total = +data[d].size;
		}
	}
	console.log(process_data);
	data = process_data
	return processForParcoods(data);
}

/*###################
Data object:
obj. literal with CCN as keys
	data:
		instructorName
		courseNumber
		courseName
	distribution:
		array of grades + size
	total: total # of students
###################*/

//process original data
function processForParcoods(data){
	var process_data = []
	for(d in data){
		var gradeDistribution = {
			aPlus: 0,
			a: 0,
			aMinus: 0,
			bPlus: 0,
			b: 0,
			bMinus: 0,
			cPlus: 0,
			c: 0,
			cMinus: 0,
			dPlus: 0,
			d: 0,
			dMinus: 0,
			f: 0
		}
		var skip = false;
		var gradeArray = data[d].distribution;
		var count = 0;
		for(g in gradeArray){
			var percentage = +(gradeArray[g].size / data[d].total * 100).toFixed(1);
			/*if(data[d].total < 15){
				skip = true;
				break;
			}*/
			if(gradeArray[g].grade == "A+"){
				count++;
				gradeDistribution.aPlus = percentage;
			}
			else if(gradeArray[g].grade == "A"){
				count++;
				gradeDistribution.a = percentage;
			}
			else if(gradeArray[g].grade == "A-"){
				count++;
				gradeDistribution.aMinus = percentage;
			}
			else if(gradeArray[g].grade == "B+"){
				count++;
				gradeDistribution.bPlus = percentage;
			}
			else if(gradeArray[g].grade == "B"){
				count++;
				gradeDistribution.b = percentage;
			}
			else if(gradeArray[g].grade == "B-"){
				count++;
				gradeDistribution.bMinus = percentage;
			}
			else if(gradeArray[g].grade == "C+"){
				count++;
				gradeDistribution.cPlus = percentage;
			}
			else if(gradeArray[g].grade == "C"){
				count++;
				gradeDistribution.c = percentage;
			}
			else if(gradeArray[g].grade == "C-"){
				count++;
				gradeDistribution.cMinus = percentage;
			}
			else if(gradeArray[g].grade == "D+"){
				count++;
				gradeDistribution.dPlus = percentage;
			}
			else if(gradeArray[g].grade == "D"){
				count++;
				gradeDistribution.d = percentage;
			}
			else if(gradeArray[g].grade == "D-"){
				count++;
				gradeDistribution.dMinus = percentage;
			}
			else if(gradeArray[g].grade == "F"){
				count++;
				gradeDistribution.d = percentage;
			}
			else{
				if(count == 0)
					skip = true;
			}
		}
		if(!skip){
			process_data.push({
				name: data[d].data.courseNumber + " w/ " + data[d].data.instructorName.split(';')[0],
				aPlus: gradeDistribution.aPlus,
				a: gradeDistribution.a,
				aMinus: gradeDistribution.aMinus,
				bPlus: gradeDistribution.bPlus,
				b: gradeDistribution.b,
				bMinus: gradeDistribution.bMinus,
				cPlus: gradeDistribution.cPlus,
				c: gradeDistribution.c,
				cMinus: gradeDistribution.cMinus,
				dPlus: gradeDistribution.dPlus,
				d: gradeDistribution.d,
				dMinus: gradeDistribution.dMinus,
				f: gradeDistribution.f,
				totalStdnts: data[d].total
			})
		}
	}
	process_data.push({
		name: '',
		aPlus: 100,
		a: 100,
		aMinus: 100,
		bPlus: 100,
		b: 100,
		bMinus: 100,
		cPlus: 100,
		c: 100,
		cMinus: 100,
		dPlus: 100,
		d: 100,
		dMinus: 100,
		f: 100,
	})
	process_data.push({
		name: '',
		aPlus: 0,
		a: 0,
		aMinus: 0,
		bPlus: 0,
		b: 0,
		bMinus: 0,
		cPlus: 0,
		c: 0,
		cMinus: 0,
		dPlus: 0,
		d: 0,
		dMinus: 0,
		f: 0,
	})

	console.log(process_data);
	createGraph(process_data);
	current_process_data = process_data
	data = process_data;
	return data;
}

/*Data representation
*Parallel coordinates, each bar is grade + % is height
*floating querable circles -> size is dependent on % of grade?
*chart with a circle representing % of grades - http://neuralengr.com/asifr/journals/
*/


//############################
//############################
setTimeout(function(){
	document.getElementById("btn-1").addEventListener('click', function(){
		console.log('btn-1')
		var tempData = current_process_data.slice();
		for(d in tempData){
			if(tempData[d].totalStdnts < 50){
				var index = tempData.indexOf(tempData[d]);
				tempData.splice(index, 1)
			}
		}
		console.log(tempData.length)
		createGraph(tempData)
	})
	document.getElementById("btn-3").addEventListener('click', function(){
		console.log('btn-4')
		createGraph(process_data_F15.slice())
		loadData("Grade_Distribution_Fall_2014.csv", process_data_F15, 651);
	})
	document.getElementById("btn-4").addEventListener('click', function(){
		console.log('btn-4')
		createGraph(process_data_S14.slice())
		loadData("Grade_Distribution_Spring_2015.csv", process_data_S14, 651);
	})
	document.getElementById("btn-5").addEventListener('click', function(){
		console.log('btn-4')
		createGraph(process_data_Sum14.slice())
		loadData("Grade_Distribution_Sum_2014.csv", process_data_Sum14, 151);
	})
},1000)

function createGraph(data){
	document.getElementById("chartArea").innerHTML = "";
  var colorgen = d3.scale.ordinal()
	  .range(["brown", "#999", "#999", "steelblue"]);

  var color = function(d) { return colorgen(d.name); };

  var parcoords = d3.parcoords()("#chartArea")
		.data(data)
    .color(color)
    //.alpha(0.30)
    .margin({ top: 24, left: 160, bottom: 12, right: -30 })
    .mode("queue")
    .render()
    .brushMode("1D-axes");  // enable brushing

  parcoords.svg.selectAll("text")
    .style("font", "10px sans-serif");
}
