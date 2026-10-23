from journal.sync.hosted_option import HOSTED
from journal.http.support.request import Request
from journal.http.support.session_cookie import SessionCookie
from journal.repositories.browser_sessions import BrowserSessions
from journal.repositories.setting_rows import SettingRows
from journal.support.response import Response

OPEN_PATHS = ("/sign-in", "/hooks/", "/cli", "/shell/")


class LoginGate:
    """A hosted journal's door: every request but the sign-in page, the hooks and the CLI needs a browser session, and one without is sent to /sign-in when it asks for a page and refused 401 when it asks the API; a journal that is not hosted has no door."""

    def __init__(self, settings: SettingRows, sessions: BrowserSessions) -> None:
        self.settings, self.sessions = settings, sessions

    def refusal(self, request: Request) -> Response | None:
        if not self.settings.option(HOSTED) or request.path.startswith(OPEN_PATHS) or self.sessions.session(SessionCookie.key(request.cookie)):
            return None
        if request.path.startswith("/journal/"):
            return Response(401, {"error": "sign in with your team account at /sign-in"})
        return Response(303, None, {"Location": "/sign-in"})
