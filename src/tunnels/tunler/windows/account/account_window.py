from engine.viewer.window import Window
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from tunnels.tunler.support.skeletons import TUNLER_ACCOUNT_SKELETON
from tunnels.tunler.windows.account.keys.status_key import StatusKey
from tunnels.tunler.windows.account.keys.version_key import VersionKey
from tunnels.tunler.windows.account.keys.domains_key import DomainsKey


class AccountWindow(Window):
    """The Tunler window."""

    name = "tunler.account"
    title = "Tunler"
    entry = "tunler.js"
    loading = WindowLoading.COMPONENT
    skeleton = TUNLER_ACCOUNT_SKELETON
    group = "project"
    place = WindowPlace.PAGE
    icon = WindowIcon.SHARE
    reads = ["tunler status", "tunler domains", "tunler version"]
    runs = ["tunler login", "tunler logout", "tunler update", "tunler install", "tunler release", "setting set"]
    keys = [StatusKey, VersionKey, DomainsKey]
