from journal.features.plugins.plugin_tokens import PluginTokens
from journal.models.actor import Actor
from journal.repositories.users import Users

LOCAL_USER = 1


class Identity:
    """Reads who a request is from: the viewer or phone carries the user's token, and the local viewer with no token is the one local user, and a plugin's program names itself with the token it was given. A hook names its agent in its body, not here."""

    def __init__(self, users: Users, tokens: PluginTokens) -> None:
        self.users, self.tokens = users, tokens

    def of(self, headers: dict) -> Actor:
        plugin = headers.get("x-journal-plugin", "")
        if plugin and self.tokens.holds(plugin, headers.get("x-journal-plugin-token", "")):
            return Actor.plugin(plugin)
        return Actor.user(LOCAL_USER)
