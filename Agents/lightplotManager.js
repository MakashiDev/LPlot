const fs = require("fs");

const schema = {
	type: "object",
	properties: {
		owner: {
			type: "string",
		},
		id: {
			type: "string",
		},
		name: {
			type: "string",
		},
		description: {
			type: "string",
		},
		access: {
			type: "array",
			items: {
				type: "string",
			},
		},
		created: {
			type: "string",
			format: "date-time",
		},
		updated: {
			type: "string",
			format: "date-time",
		},
		lightplot: {
			type: "object",
			properties: {
				left: {
					type: "array",
					items: {
						type: "object",
						properties: {
							id: {
								type: "string",
							},
							color: {
								type: "string",
							},
						},
						required: ["id", "color"],
					},
				},
				middle: {
					type: "array",
					items: {
						type: "object",
						properties: {
							id: {
								type: "string",
							},
							color: {
								type: "string",
							},
						},
						required: ["id", "color"],
					},
				},
				right: {
					type: "array",
					items: {
						type: "object",
						properties: {
							id: {
								type: "string",
							},
							color: {
								type: "string",
							},
						},
						required: ["id", "color"],
					},
				},
			},
			required: ["left", "middle", "right"],
		},
	},
	required: ["owner", "name", "access", "created", "updated", "lightplot"],
};

class LightPlotManager {
	constructor() {
		this.lightplots = [];
		this.loadLightPlots();
	}

	loadLightPlots() {
		// read lightplots directory and load all lightplots
		const lightplotFiles = fs.readdirSync("lightplots");
		this.lightplots = [];
		lightplotFiles.forEach((lightplotFile) => {
			const lightplot = JSON.parse(
				fs.readFileSync(`lightplots/${lightplotFile}`)
			);
			this.lightplots.push(lightplot);
		});
	}

	getLightPlot(id, user_id) {
		let lightplot = this.lightplots.find(
			(s) => s.id === id && s.access.includes(user_id.toString())
		);
		if (!lightplot) return null;
		return lightplot;
	}

	getLightPlotsFromAccess(user_id) {
		let lightplots = this.lightplots.filter((s) =>
			s.access.includes(user_id.toString())
		);
		return lightplots;
	}

	createLightPlot(name, description, owner, access, lightplot) {
		const id = Math.random().toString(36).substr(2, 9);
		const created = new Date().toISOString();
		const updated = new Date().toISOString();
		const newLightPlot = {
			owner,
			id,
			name,
			description,
			access,
			created,
			updated,
			lightplot,
		};
		console.log(newLightPlot);
		const valid = this.validateLightPlot(newLightPlot);
		if (!valid) return null;
		fs.writeFileSync(`lightplots/${id}.json`, JSON.stringify(newLightPlot));
		this.loadLightPlots();
		return newLightPlot;
	}

	validateLightPlot(lightplot) {
		const Ajv = require("ajv");
		const addFormats = require("ajv-formats");
		const ajv = new Ajv();
		addFormats(ajv);
		const validate = ajv.compile(schema);
		const valid = validate(lightplot);
		if (!valid) {
			console.log(validate.errors);
			return false;
		}
		return true;
	}

	updateLightPlot(lightplot, id) {
		let index = this.lightplots.findIndex(
			(s) => s.id === lightplot.id && s.access.includes(id.toString())
		);
		this.lightplots[index] = lightplot;
		fs.writeFileSync(
			`lightplots/${lightplot.id}.json`,
			JSON.stringify(lightplot)
		);
		this.loadLightPlots();
	}
}

module.exports = new LightPlotManager();
