var total = 0;
var values = [];
var labels = [];
var canvas, context;

//////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function () {
	canvas = document.querySelector("#myCanvas");
	context = canvas.getContext("2d");

	var script = document.createElement("script");
	script.src = "./json/cheese.json";
	document.querySelector('body').appendChild(script);
	script.addEventListener("load", function () {

		for (var i = 0; i < data[0].segments.length; i++) {
			values.push(data[0].segments[i].value);
			labels.push(data[0].segments[i].label);
			total += values[i];
		}
		addButtonListeners()
		pieChart();
	});
});

//////////////////////////////////////////////////////

function setDefaultStyles() {
	context.strokeStyle = "#333";
	context.lineWidth = 3;
	context.font = "bold 16pt Arial";
	context.fillStyle = "#900";
	context.textAlign = "left";
}

//////////////////////////////////////////////////////

function pieChart() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	setDefaultStyles();

	var cx = canvas.width / 2.5;
	var cy = canvas.height / 2;
	var radius = 100;
	var currentAngle = 0;

	for (var i = 0; i < values.length; i++) {
		var pct = values[i] / total;
		var clr = data[0].segments[i].color;
		var endAngle = currentAngle + (pct * (Math.PI * 2));
		//console.log((pct * (Math.PI * 2))); //Find out which object is biggest and smallest
		context.moveTo(cx, cy);
		context.beginPath();
		context.fillStyle = clr;

		if ((pct * (Math.PI * 2)) > 1.5) { //Biggest
			context.arc(cx, cy, radius * 0.9, currentAngle, endAngle, false);
			context.lineTo(cx, cy);
			context.fill();
		} else if ((pct * (Math.PI * 2)) < 0.5) { //Smallest
			context.arc(cx, cy, radius * 1.1, currentAngle, endAngle, false);
			context.lineTo(cx, cy);
			context.fill();
		} else { //Other
			context.arc(cx, cy, radius, currentAngle, endAngle, false);
			context.lineTo(cx, cy);
			context.fill();
		}

		context.save();
		context.translate(cx, cy);
		context.strokeStyle = "#000";
		context.lineWidth = 1;
		context.beginPath();
		var midAngle = (currentAngle + endAngle) / 2;
		context.moveTo(0, 0);
		var dx = Math.cos(midAngle) * (0.8 * radius);
		var dy = Math.sin(midAngle) * (0.8 * radius);
		context.moveTo(dx, dy);
		var dx = Math.cos(midAngle) * (radius + 50);
		var dy = Math.sin(midAngle) * (radius + 50);
		context.lineTo(dx, dy);
		context.font = '10pt Calibri';
		context.fillStyle = '#232f41';
		context.fillText(labels[i], dx, dy);
		context.stroke();
		context.restore();
		currentAngle = endAngle;
	}
}

//////////////////////////////////////////////////////

function BarChart() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	setDefaultStyles();

	var numPoints = values.length;
	var padding = 20;
	var magnifier = 10;
	var currentPoint = 0;
	var x = -20;
	var y = canvas.height - 20;

	for (var i = 0; i < values.length; i++) {
		var pct = Math.round((values[i] / total) * 100);
		var clr = data[0].segments[i].color;

		x = x + 60;
		context.beginPath();
		context.fillStyle = clr;
		context.strokeStyle = data[0].segments[i].color;
		context.lineWidth = 1;
		context.rect(x, y, 30, -pct * magnifier);
		context.closePath();
		context.fill();
		context.stroke();
		context.font = "normal 10pt Calibri";
		context.textAlign = "center";
		context.fillStyle = "#000";
		context.beginPath();
		context.fillText(labels[i], x + 12, y + 15);
		context.fillText(pct + "%", x + 15, y - 10 - pct * magnifier);
		context.closePath();
	}
}

//////////////////////////////////////////////////////

function addButtonListeners() {
	document.querySelector("#btnPieC").addEventListener("click", pieChart);
	document.querySelector("#btnBarC").addEventListener("click", BarChart);
}