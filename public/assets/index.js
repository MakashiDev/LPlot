let selected;

const urlParams = new URLSearchParams(window.location.search);

const lights = {
	left: [],
	middle: [],
	right: [],
};

let username = urlParams.get("name");
let description = urlParams.get("description");
let id = urlParams.get("id");
if (id) {
	//TODO: Fetch the lightplot from the server and populate the lights

	fetch(`/lightplot/${id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((res) => res.json())
		.then((data) => {
			lightplot = data.lightplot;
			console.log(data);
			username = lightplot.name;
			description = lightplot.description;
			console.log(lightplot);
			populateLights(lightplot.lightplot);
			lights = lightplot.lightplot;
		});
} else {
	// Create a new lightplot
	setTimeout(init, 1000);
}

const configMenu = document.getElementById("config-menu");
const leftRackInput = document.getElementById("lRack");
const middleRackInput = document.getElementById("mRack");
const rightRackInput = document.getElementById("rRack");

const configBtn = document.getElementById("config-btn");
const menuBtn = document.getElementById("menu-btn");
const savebtn = document.getElementById("save-btn");

leftRackInput.addEventListener("change", updateLights);
middleRackInput.addEventListener("change", updateLights);
rightRackInput.addEventListener("change", updateLights);

const leftRack = document.getElementById("left");
const middleRack = document.getElementById("middle");
const rightRack = document.getElementById("right");

let lightplot = {};

// File Buttons
savebtn.addEventListener("click", (event) => {
	// check if this is a new lightplot or an existing one by checking if we have an id
	if (!id) {
		// we are creating a new lightplot
		fetch("/lightplot/save", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: username,
				description: description,
				lightplot: lights,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				id = data.id;
				urlParams.set("id", id);
				lightplot = data.lightplot;
				console.log(data);
			});
	} else {
		// we are updating an existing lightplot
		fetch("/lightplot/save", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				owner: lightplot.owner,
				id: id,
				name: username,
				description: description,
				access: lightplot.access,
				created: lightplot.created,
				updated: lightplot.updated,
				lightplot: lights,
			}),
		})
			.then((res) => res.json())
			.then((data) => console.log(data));
	}
});

menuBtn.addEventListener("click", (e) => {
	// redirect to the lightplot menu
	window.location.href = "/";
});

function init() {
	// Initialize the lights for a new lightplot

	leftRack.innerHTML = "";
	middleRack.innerHTML = "";
	rightRack.innerHTML = "";

	const leftRackCount = leftRackInput.value;
	const middleRackCount = middleRackInput.value;
	const rightRackCount = rightRackInput.value;

	addLights("left", leftRackCount);
	addLights("middle", middleRackCount);
	addLights("right", rightRackCount);

	updateConfig();
	registerClick(lights);
}

function addLights(rack, count) {
	const lightTemplate = `<div class="h-5 w-6 flex items-center align-middle"><svg id="test" class="cursor-pointer text-amber-500" width="232" height="" viewBox="0 0 232 872" fill="currentcolor" xmlns="http://www.w3.org/2000/svg"><path d="M115.5 866.5H6V838.5L46.5 821L34 755.5L6 719.5V480.5L34 424V178.5L6 5H225.5L197.5 178.5V424L225.5 480.5V719.5L197.5 755.5L185 821L225.5 838.5V866.5H116" stroke="black" stroke-width="10" /></svg></div>`;

	switch (rack) {
		case "left":
			for (let i = 1; i <= count; i++) {
				leftRack.innerHTML += lightTemplate.replace(
					'id="test"',
					`id="light-left-${i}"`
				);
				lights.left.push({ id: `light-left-${i}`, color: "amber" });
			}
			break;
		case "middle":
			for (let i = 1; i <= count; i++) {
				middleRack.innerHTML += lightTemplate.replace(
					'id="test"',
					`id="light-middle-${i}"`
				);

				lights.middle.push({ id: `light-middle-${i}`, color: "amber" });
			}
			break;
		case "right":
			for (let i = 1; i <= count; i++) {
				rightRack.innerHTML += lightTemplate.replace(
					'id="test"',
					`id="light-right-${i}"`
				);
				lights.right.push({ id: `light-right-${i}`, color: "amber" });
			}
			break;
	}
}

function populateLights(lightplot) {
	// Populate the lights from the lightplot

	const left = lightplot.left;
	const middle = lightplot.middle;
	const right = lightplot.right;

	addLights("left", left.length);
	addLights("middle", middle.length);
	addLights("right", right.length);

	lights.left = left;
	lights.middle = middle;
	lights.right = right;

	left.forEach((light) => {
		const lightElement = document.getElementById(light.id);
		lightElement.classList.remove("text-amber-500");
		lightElement.classList.add(`text-${light.color}-500`);
	});

	middle.forEach((light) => {
		const lightElement = document.getElementById(light.id);
		lightElement.classList.remove("text-amber-500");
		lightElement.classList.add(`text-${light.color}-500`);
	});

	right.forEach((light) => {
		const lightElement = document.getElementById(light.id);
		lightElement.classList.remove("text-amber-500");
		lightElement.classList.add(`text-${light.color}-500`);
	});

	registerClick(lights);
}

function registerClick(lights) {
	const allLights = [...lights.left, ...lights.middle, ...lights.right];

	allLights.forEach((light) => {
		const lightElement = document.getElementById(light.id);
		lightElement.addEventListener("click", () => {
			let colorPicker = document.getElementById("colorPicker");
			if (selected) {
				// Reset the previous selected light
				// get the parent element of the selected light
				selected.parentElement.style.borderColor = "";
				selected.parentElement.style.borderWidth = "";
				selected.parentElement.style.borderStyle = "";
				colorPicker.classList.add("hidden");
			}

			if (selected === lightElement.children[0]) {
				selected = null;
				colorPicker.classList.add("hidden");
				return;
			}
			selected = lightElement.children[0];
			lightElement.style.borderColor = "white";
			lightElement.style.borderWidth = "1px";
			lightElement.style.borderStyle = "solid";

			console.log(lightElement.parentElement);
			colorPicker.classList.remove("hidden");
			colorPicker.style.top = `${
				lightElement.parentElement.getBoundingClientRect().top - 150
			}px`;
			colorPicker.style.left = `${
				lightElement.parentElement.getBoundingClientRect().left <
				window.innerWidth / 3
					? lightElement.parentElement.getBoundingClientRect().left
					: lightElement.parentElement.getBoundingClientRect().left -
					  60
			}px`;
		});
	});
}

function changeColor(color) {
	if (selected) {
		selected.parentElement.classList.remove("text-amber-500");
		selected.parentElement.classList.remove("text-red-500");
		selected.parentElement.classList.remove("text-green-500");
		selected.parentElement.classList.remove("text-blue-500");
		selected.parentElement.classList.remove("text-yellow-500");
		selected.parentElement.classList.remove("text-blue-500");
		selected.parentElement.classList.remove("text-purple-500");
		selected.parentElement.classList.remove("text-pink-500");
		selected.parentElement.classList.add("text-" + color + "-500");
		const id = selected.parentElement.id;
		const rack = id.split("-")[1];
		const index = id.split("-")[2] - 1;
		const light = lights[rack][index];
		light.color = color;
		let colorPicker = document.getElementById("colorPicker");
		console.log(light);
		console.log(lights);
	}
}

function updateLights() {
	init();
	updateConfig();
}

function updateConfig() {
	configBtn.addEventListener("click", (e) => {
		if (configMenu.classList.contains("hidden")) {
			configMenu.classList.remove("hidden");
		} else {
			configMenu.classList.add("hidden");
		}
	});
}
