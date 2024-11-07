import { User } from "../types/user";

export const generateUserPage = (user: User): string => {
	return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>User Info</title>
    </head>
    <body>
      <h1>User Info for ${user.name}</h1>
      <p><strong>ID:</strong> ${user.id}</p>
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <br />
      <button onclick="window.location.href='/'">Go to Dashboard</button>
    </body>
    </html>
  `;
};
