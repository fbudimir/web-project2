import express, { Request, Response } from "express";
import { Register } from "./controllers/register";
import { Login } from "./controllers/login";
import path from "path";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { checkAuth } from "../lib/checkAuth";
import { authMiddleware } from "./middleware/auth";
import { generateUserPage } from "../lib/generateUserPage";
import { getUser } from "./controllers/getUser";
import { User } from "../types/user";
import { generateDashboardPage } from "../lib/generateDashboard";
import { listUsers } from "./controllers/listUsers";
import { generateLoginPage } from "../lib/generateLoginPage";
import { addComment } from "./controllers/addComment";
import { listComments } from "./controllers/listComments";
import sanitizeHtml from "sanitize-html";
import { delComment } from "./controllers/delComment";

const jwtSecret = process.env.JWT_SECRET!;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/views", express.static(path.join(__dirname, "../app/views")));
app.use(cookieParser());

// index page or dashboard
app.get("/", async (req: Request, res: Response) => {
	let id = null;

	try {
		id = await checkAuth(req);
	} catch (error) {
		console.error("Auth error", error);
		res.status(500).json({ message: "Auth error" });
	}

	if (id) {
		try {
			const users = await listUsers();
			const comments = await listComments();

			res.send(generateDashboardPage(users, comments));
		} catch (error) {
			console.error("Error fetching users:", error);
			res.status(500).json({ message: "Error fetching users" });
		}
	} else {
		res.sendFile(path.join(__dirname, "../app/views/index.html"));
	}
});

// register page
app.get("/register", async (req: Request, res: Response) => {
	let id = null;

	try {
		id = await checkAuth(req);
	} catch (error) {
		res.status(500).json({ message: "Error checking authentication" });
	}

	if (id) res.redirect("/");
	else res.sendFile(path.join(__dirname, "../app/views/register.html"));
});

// login page
app.get("/login", async (req: Request, res: Response) => {
	let id = null;

	try {
		id = await checkAuth(req);
	} catch (error) {
		console.error("Auth error", error);
		res.status(500).json({ message: "Auth error" });
	}

	if (id) res.redirect("/");
	else res.send(generateLoginPage());
});

// register
app.post("/register", async (req: Request, res: Response) => {
	const { email, name, password } = req.body;

	try {
		const user = await Register(email, name, password);
		const token = jwt.sign({ id: user.id }, jwtSecret, {
			expiresIn: "24h",
		});

		res.cookie("auth_token", token, { httpOnly: true, maxAge: 24 * 3600000 });

		res.redirect("/");
	} catch (error) {
		console.error("Error registering user:", error);
		res.status(500).json({ message: "Error registering user" });
	}
});

// login
app.post("/login", async (req: Request, res: Response) => {
	const { email, password } = req.body;

	try {
		const user = await Login(email, password);

		setTimeout(() => {
			if (user) {
				const token = jwt.sign({ id: user.id }, jwtSecret, {
					expiresIn: "24h",
				});

				res.cookie("auth_token", token, {
					httpOnly: true,
					maxAge: 24 * 3600000,
				});

				res.redirect("/");
			} else {
				res.send(generateLoginPage("Invalid username or password"));
			}
		}, 2000); // 2 sekunde
	} catch (error) {
		console.error("Error logging in user:", error);
		res.status(500).json({ message: "Error logging in user" });
	}
});

// logout
app.post("/logout", (req: Request, res: Response) => {
	res.clearCookie("auth_token");
	res.redirect("/");
});

// user page, provjeri broken access control checkbox
app.post("/user", async (req: Request, res: Response) => {
	const userId = req.body.userId;
	const isBrokenAccessControl = req.body.brokenAccessControl === "true";

	let id = null;

	const user = (await getUser(userId)) as User;

	if (!user) {
		res
			.status(404)
			.sendFile(path.join(__dirname, "../app/views/notfound.html"));
	}

	// Broken access control //////////////////////////////////////////
	///////////////////////////////////////////////////////////////////
	if (isBrokenAccessControl) {
		res.send(generateUserPage(user));
	} else {
		try {
			id = await checkAuth(req);
		} catch (error) {
			console.error("Auth error", error);
			res.status(500).json({ message: "Auth error" });
		}

		if (id && id === userId) {
			res.send(generateUserPage(user));
		} else
			res
				.status(404)
				.sendFile(path.join(__dirname, "../app/views/notfound.html"));
	}
	///////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////
});

// user specific stranica
app.get("/user/:id", authMiddleware, async (req: Request, res: Response) => {});

// dodaj komentar, provjera XSS checkboxa
app.post("/addComment", async (req: Request, res: Response) => {
	const xss = req.body.xss === "true";

	let id = null;

	try {
		id = await checkAuth(req);
	} catch (error) {
		console.error("Auth error", error);
		res.status(500).json({ message: "Auth error" });
	}

	// XSS ////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////
	if (xss) {
		await addComment(id!, req.body.comment);

		res.redirect(`/`);
	} else {
		const sanitizedComment = sanitizeHtml(req.body.comment, {
			allowedTags: [],
			allowedAttributes: {},
		});

		await addComment(id!, sanitizedComment);

		res.redirect(`/`);
	}
	///////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////
});

// remove a comment
app.post("/delComment", async (req: Request, res: Response) => {
	const { commentId } = req.body;

	await delComment(commentId);

	res.redirect(`/`);
});

// 404
app.use((req: Request, res: Response) => {
	res.status(404).sendFile(path.join(__dirname, "../app/views/notfound.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
