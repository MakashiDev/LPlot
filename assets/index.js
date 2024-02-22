setTimeout(init, 1000);

let selected;

const configMenu = document.getElementById('config-menu');
const leftRackInput = document.getElementById("lRack");
const middleRackInput = document.getElementById("mRack");
const rightRackInput = document.getElementById("rRack");

const configBtn = document.getElementById('config-btn');
const openBtn = document.getElementById('open-btn');
const savebtn = document.getElementById('save-btn');

leftRackInput.addEventListener("change", updateLights);
middleRackInput.addEventListener("change", updateLights);
rightRackInput.addEventListener("change", updateLights);

function init() {
	const leftRack = document.getElementById("left");
	const middleRack = document.getElementById("middle");
	const rightRack = document.getElementById("right");

	leftRack.innerHTML = "";
	middleRack.innerHTML = "";
	rightRack.innerHTML = "";

	const lights = {
		left: [],
		middle: [],
		right: [],
	};
	const leftRackCount = leftRackInput.value;
	const middleRackCount = middleRackInput.value;
	const rightRackCount = rightRackInput.value;
	const lightTemplate = `<div class="[&>*]:h-[5rem] [&>*]:w-6 flex items-center align-middle"><svg id="test" class="cursor-pointer text-amber-400" width="232" height="872" viewBox="0 0 232 872" fill="currentcolor" xmlns="http://www.w3.org/2000/svg"><path d="M115.5 866.5H6V838.5L46.5 821L34 755.5L6 719.5V480.5L34 424V178.5L6 5H225.5L197.5 178.5V424L225.5 480.5V719.5L197.5 755.5L185 821L225.5 838.5V866.5H116" stroke="black" stroke-width="10" /></svg></div>`;

	// Left Rack
	for (let i = 1; i <= leftRackCount; i++) {
		lights.left.push({
			id: `light-${i}`,
			color: "white",
		});

		leftRack.innerHTML += lightTemplate.replace(
			'id="test"',
			`id="light-${i}"`
		);
	}

	// Middle Rack
	for (let i = 1; i <= middleRackCount; i++) {
		lights.middle.push({
			id: `light-${i + leftRackCount}`,
			color: "white",
		});

		middleRack.innerHTML += lightTemplate.replace(
			'id="test"',
			`id="light-${i + leftRackCount}"`
		);
	}

	// Right Rack
	for (let i = 1; i <= rightRackCount; i++) {
		lights.right.push({
			id: `light-${i + leftRackCount + middleRackCount}`,
			color: "white",
		});

		rightRack.innerHTML += lightTemplate.replace(
			'id="test"',
			`id="light-${i + leftRackCount + middleRackCount}"`
		);
	}

    // Open config Menu
    configBtn.addEventListener('click', (e) =>{
        if (configMenu.classList.contains("hidden")) {
            configMenu.classList.remove("hidden");
        } else {
            configMenu.classList.add("hidden");
        };
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
		selected.classList.remove("text-amber-500");
		selected.classList.remove("text-red-500");
		selected.classList.remove("text-green-500");
		selected.classList.remove("text-blue-500");
		selected.classList.remove("text-yellow-500");
		selected.classList.remove("text-indigo-500");
		selected.classList.remove("text-purple-500");
		selected.classList.remove("text-pink-500");
		selected.classList.add("text-" + color + "-500");
	}
}

function updateLights() {
	init();
}
