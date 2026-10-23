import html

from journal.http.support.file_response import FileResponse
from journal.http.support.request import Request
from journal.http.support.session_cookie import SessionCookie
from journal.repositories.browser_sessions import BrowserSessions
from journal.support.response import Response
from journal.sync.team_account import TeamAccount
from journal.sync.team_refusal import TeamRefusal
from journal.sync.team_server_link import TeamServerLink
from sync_server.login_request import LoginRequest

DEVICE_NAME = "a browser on the hosted journal"
PAGE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sign in</title>
<style>
:root {{ color-scheme: dark; }}
body {{ margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0e0f12; color: #e6e6e6; font: 14px/1.5 system-ui, sans-serif; }}
form {{ width: min(320px, calc(100vw - 32px)); display: grid; gap: 12px; }}
h1 {{ margin: 0 0 4px; font-size: 18px; font-weight: 600; }}
label {{ display: grid; gap: 4px; color: #a0a3ab; font-size: 12px; }}
input {{ padding: 8px 10px; border: 1px solid #2a2c33; border-radius: 6px; background: #16171b; color: inherit; font: inherit; }}
button {{ padding: 8px 10px; border: 0; border-radius: 6px; background: #3b6ef5; color: #fff; font: inherit; cursor: pointer; }}
p {{ margin: 0; color: #f08a8a; }}
</style>
</head>
<body>
<form method="post" action="/sign-in" enctype="multipart/form-data">
<h1>Sign in to the team's journal</h1>
<label>Email<input name="email" type="email" autocomplete="username" required></label>
<label>Password<input name="password" type="password" autocomplete="current-password" required></label>
{error}
<button type="submit">Sign in</button>
</form>
</body>
</html>
"""


class LoginController:
    """The sign-in of a hosted journal: the form, the team server's check of the email and password, which opens a browser session for that person, and the sign-out, which ends it."""

    def __init__(self, sessions: BrowserSessions, link: TeamServerLink, account: TeamAccount) -> None:
        self.sessions, self.link, self.account = sessions, link, account

    def show(self, request: Request) -> FileResponse:
        return self.page("", 200)

    def submit(self, request: Request) -> FileResponse | Response:
        try:
            login = self.link.login(self.account.address(), LoginRequest(str(request.body.get("email", "")), str(request.body.get("password", "")), DEVICE_NAME))
        except TeamRefusal as refused:
            return self.page(f"<p>{html.escape(str(refused))}</p>", 401)
        key = self.sessions.opened(login.account_id, login.name)
        return Response(303, None, {"Location": "/", "Set-Cookie": SessionCookie.value(key, request.protocol)})

    def logout(self, request: Request) -> Response:
        self.sessions.closed(SessionCookie.key(request.cookie))
        return Response(303, None, {"Location": "/sign-in", "Set-Cookie": SessionCookie.expired_value(request.protocol)})

    @staticmethod
    def page(error: str, status: int) -> FileResponse:
        return FileResponse("text/html; charset=utf-8", PAGE.format(error=error).encode(), status)
