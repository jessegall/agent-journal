from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class UsersKey(WindowKey):
    """The users data of the library.teams window."""

    name = "users"
    read = "library-user list"
    loading = KeyLoading.REQUESTED
