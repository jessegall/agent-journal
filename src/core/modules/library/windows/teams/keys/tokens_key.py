from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class TokensKey(WindowKey):
    """The tokens data of the library.teams window."""

    name = "tokens"
    read = "library-user tokens {user}"
    loading = KeyLoading.REQUESTED
