export const generateLoginPage = (error?: string) => {
	return `
    <!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Login</title>
	</head>
	<body>
		<button onclick="window.location.href='/'">Go to Home</button>
		<br />
		<button onclick="window.location.href='/register'">Go to Register</button>
		<br />
		<h1>Login</h1>
        ${
					error
						? `<div style="color: red;"><strong>${error}</strong></div>`
						: ""
				}
		<form action="/login" method="POST">
			<label for="email">Email:</label>
			<input type="text" id="email" name="email" required />

			<label for="password">Password:</label>
			<input type="password" id="password" name="password" required />

			<button type="submit">Login</button>
		</form>
	</body>
</html>

  `;
};
