from engine.viewer.window import Window
from core.modules.tunnel.support.skeletons import TUNNEL_TUNNEL_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from core.modules.tunnel.windows.tunnel.keys.status_key import StatusKey


class TunnelWindow(Window):
    """The Tunnel window."""

    name = "tunnel.tunnel"
    title = "Tunnel"
    entry = "tunnel.js"
    loading = WindowLoading.COMPONENT
    skeleton = TUNNEL_TUNNEL_SKELETON
    group = "project"
    place = WindowPlace.PAGE
    icon = WindowIcon.SHARE
    reads = ["tunnel status"]
    keys = [StatusKey]
