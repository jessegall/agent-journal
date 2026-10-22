from journal.http.support.plugin_claim import PluginClaim
from journal.support.plugin_tokens import PluginTokens
from journal.support.actor import Actor
from journal.repositories.users import Users
from journal.sync.team_account import TeamAccount


class Identity:
    """Reads who a request is from: the viewer or phone carries the user's token, and the local viewer with no token is this machine's person, user 1 in a journal in no team, and a plugin's program names itself with the token it was given. A hook names its agent in its body, not here."""

    def __init__(self, users: Users, tokens: PluginTokens, account: TeamAccount) -> None:
        self.users, self.tokens, self.account = users, tokens, account

    def build(self, headers: dict) -> Actor:
        claim = PluginClaim.header_claim(headers)
        if claim.plugin and self.tokens.matches(claim.plugin, claim.token):
            return Actor.plugin(claim.plugin)
        return Actor.user(self.account.user_number())
