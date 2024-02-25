const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const port = 3000;

console.log(process.env);
const JWT_SECRET = process.env.TOKEN;
const LightPlotManager = require("./Agents/lightplotManager");

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
	if (!req.cookies) return res.sendStatus(401); // Unauthorized
	const token = req.cookies.token;
	if (!token) return res.sendStatus(401); // Unauthorized

	jwt.verify(token, JWT_SECRET, (err, user) => {
		if (err) return res.sendStatus(403); // Forbidden
		req.user = user;
		next();
	});
};

let users = fs.readFileSync("users.json", "utf8");
users = JSON.parse(users);

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/lightplot/:id", authenticateToken, (req, res) => {
	const id = req.params.id;
	const lightplot = LightPlotManager.getLightPlot(id, req.user.id);
	if (!lightplot) return res.sendStatus(404); // Not found
	res.json({ lightplot });
});

app.get("/lightplot", authenticateToken, (req, res) => {
	res.sendFile(path.join(__dirname, "public", "lightPlot.html"));
});

app.post("/lightplot/save", authenticateToken, (req, res) => {
	const user = req.user;
	const id = user.id;
	const lightplot = req.body;
	if (!lightplot) return res.sendStatus(400); // Bad request
	if (!lightplot.id) {
		let newLightPlot = LightPlotManager.createLightPlot(
			lightplot.name,
			lightplot.description,
			id.toString(),
			[id.toString()],
			lightplot.lightplot
		);
		res.json({
			message: "Lightplot saved",
			id: newLightPlot.id,
			lightplot: newLightPlot,
		});
		return;
	}

	LightPlotManager.updateLightPlot(lightplot, id);
	res.json({ message: "Lightplot saved" });
});

app.get("/login", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/lightplots", authenticateToken, (req, res) => {
	const user = req.user;
	const id = user.id;

	const lightplots = LightPlotManager.getLightPlotsFromAccess(id);
	res.json({ lightplots });
});

// Login route
app.post("/login", async (req, res) => {
	const { username, password } = req.body;
	const user = users.find((u) => u.username === username);
	if (!user)
		return res
			.status(400)
			.json({ message: "Invalid username or password" });

	try {
		if (password == user.password) {
			const accessToken = jwt.sign(
				{ username: user.username, id: user.id },
				JWT_SECRET
			);
			res.setHeader("Set-Cookie", "token=" + accessToken + "; HttpOnly");
			res.json({ accessToken });
		} else {
			res.status(400).json({ message: "Invalid username or password" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal server error" });
	}
});

// Protected route
app.get("/protected", authenticateToken, (req, res) => {
	res.json({
		message: "Protected route accessed successfully",
		user: req.user,
	});
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
	console.log(`
    Visit http://localhost:${port}
    `);
});
