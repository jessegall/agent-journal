from journal.http.support.plugin_claim import PluginClaim
from journal.support.plugin_tokens import PluginTokens
from journal.support.actor import Actor
from journal.repositories.users import Users

LOCAL_USER = 1


class Identity:
    """Reads who a request is from: the viewer or phone carries the user's token, and the local viewer with no token is the one local user, and a plugin's program names itself with the token it was given. A hook names its agent in its body, not here."""

    def __init__(self, users: Users, tokens: PluginTokens) -> None:
        self.users, self.tokens = users, tokens

    def build(self, headers: dict) -> Actor:
        claim = PluginClaim.header_claim(headers)
        if claim.plugin and self.tokens.matches(claim.plugin, claim.token):
            return Actor.plugin(claim.plugin)
        return Actor.user(LOCAL_USER)
