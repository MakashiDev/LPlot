setTimeout(init, 1000);

let selected;

function init() {
    const leftRack = document.getElementById('left');
    const middleRack = document.getElementById('middle');
    const rightRack = document.getElementById('right');

    const lights = {
        1: 'light-1',
        2: 'light-2',
        3: 'light-3',
        4: 'light-4',
        5: 'light-5',
        6: 'light-6',
        7: 'light-7',
        8: 'light-8',
        10: 'light-10',
        11: 'light-11',
        12: 'light-12',
        13: 'light-13',
        14: 'light-14',
        15: 'light-15',
        16: 'light-16',
        17: 'light-17',
        18: 'light-18',
        19: 'light-19',
        20: 'light-20',
        21: 'light-21',
        23: 'light-23',
        24: 'light-24',
        25: 'light-25',
        26: 'light-26',
        27: 'light-27',
        28: 'light-28',
        29: 'light-29',
        30: 'light-30',
    };
    const leftNum = 8;
    const middleNum = 21;
    const rightNum = 30;
    const lightTemplate = `<div class="[&>*]:h-[5rem] [&>*]:w-6 flex items-center align-middle"><svg id="test" class="cursor-pointer" width="232" height="872" viewBox="0 0 232 872" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M115.5 866.5H6V838.5L46.5 821L34 755.5L6 719.5V480.5L34 424V178.5L6 5H225.5L197.5 178.5V424L225.5 480.5V719.5L197.5 755.5L185 821L225.5 838.5V866.5H116" stroke="black" stroke-width="10" /></svg></div>`;

    // Left Rack
    for (let i = 1; i <= leftNum; i++) {
        leftRack.innerHTML += lightTemplate.replace('id="test"', `id="light-${i}"`);
    };

    // Middle Rack
    for (let i = 10; i <= middleNum; i++) {
        middleRack.innerHTML += lightTemplate.replace('id="test"', `id="light-${i}"`);
    };

    // Right Rack
    for (let i = 23; i <= rightNum; i++) {
        rightRack.innerHTML += lightTemplate.replace('id="test"', `id="light-${i}"`);
    };

    registerClick(lights);
};

function registerClick(lights) {
    for (const [num, id] of Object.entries(lights)) {
        let light = document.getElementById(id);

        light.addEventListener('click', (e) =>{
            if (selected == light) {
                selected.setAttribute('fill', 'white');;
                selected = null;
            } else {
                light.setAttribute('fill', 'gray');
                
                if (selected != null) {
                    selected.setAttribute('fill', ' white');
                }
                
                selected = light;
            };
        });
    };
};