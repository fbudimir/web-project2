import { User } from "../types/user";
import { Comment } from "../types/comment";

export const generateDashboardPage = (users: User[], comments: Comment[]) => {
	return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Dashboard</title>
      </head>
      <body>
        <h1>Dashboard for web project 2</h1>
        
        <form action="/logout" method="POST" style="display: inline">
          <button type="submit">Logout</button>
        </form>

        <br/>
        <br/>
        <hr/>
        
        <h2>Users:</h2>
        <form action="/user" method="POST">
          <label for="brokenAccessControl">Broken Access Control allowed?</label>
          <input type="checkbox" id="brokenAccessControl" name="brokenAccessControl" value="true" />
          <br/>
          <br/>
          <div>
            ${users
							.map(
								(user) => `
                <button type="submit" name="userId" value="${user.id}">Go to User ${user.name}</button><br/>
              `
							)
							.join("")}
          </div>
        </form>

        <br/>
        <hr/>
        
        <h2>Comments:</h2>
        <form action="/addComment" method="POST">
          <label for="xss">XSS allowed for this comment?</label>
          <input type="checkbox" id="xss" name="xss" value="true" />
          <br/>
          <br/>
          <textarea name="comment" rows="4" cols="50" placeholder="Write your comment here..." required></textarea>
          <br/>
          <button type="submit">Add Comment</button>
        </form>
        <br/>

        <div>
          ${comments
						.map(
							(comment) => `
              <div style="border: 1px solid #ccc; padding: 10px; margin: 10px 0;">
                <strong>${comment.name}:</strong>
                <p>${comment.body}</p>
                <form action="/delComment" method="POST" style="display: inline;">
                  <input type="hidden" name="commentId" value="${comment.id}" />
                  <button type="submit">Delete</button>
                </form>
              </div>
            `
						)
						.join("")}
            <br/>
            <p>NOTE: Mogucnost brisanja svakog komentara je tu samo radi pogodnosti.</p>
        </div>
      </body>
    </html>
  `;
};
