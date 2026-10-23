from journal.http.support.plugin_claim import PluginClaim
from journal.http.support.session_cookie import SessionCookie
from journal.repositories.browser_sessions import BrowserSessions
from journal.support.plugin_tokens import PluginTokens
from journal.support.actor import Actor
from journal.repositories.users import Users
from journal.sync.team_account import TeamAccount


class Identity:
    """Reads who a request is from: the viewer or phone carries the user's token, and the local viewer with no token is this machine's person, user 1 in a journal in no team, a browser signed in to a hosted journal is the person it signed in as, and a plugin's program names itself with the token it was given. A hook names its agent in its body, not here."""

    def __init__(self, users: Users, tokens: PluginTokens, account: TeamAccount, sessions: BrowserSessions) -> None:
        self.users, self.tokens, self.account, self.sessions = users, tokens, account, sessions

    def build(self, headers: dict, cookie: str) -> Actor:
        claim = PluginClaim.header_claim(headers)
        if claim.plugin and self.tokens.matches(claim.plugin, claim.token):
            return Actor.plugin(claim.plugin)
        session = self.sessions.session(SessionCookie.key(cookie))
        return Actor.user(session.person if session else self.account.user_number())
