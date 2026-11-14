from engine.viewer.window import Window
from core.modules.phone.support.phone_searcher import PhoneSearcher
from core.modules.phone.support.skeletons import PHONE_PHONES_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.viewer.window_search import WindowSearch
from core.modules.phone.windows.phones.keys.phones_key import PhonesKey
from core.modules.phone.windows.phones.keys.tunnel_key import TunnelKey


class PhonesWindow(Window):
    """The Phones window."""

    name = "phone.phones"
    title = "Phones"
    entry = "phones.js"
    loading = WindowLoading.COMPONENT
    skeleton = PHONE_PHONES_SKELETON
    search = WindowSearch(PhoneSearcher, "Search the phones")
    group = "project"
    icon = WindowIcon.PHONE
    reads = ["phone list", "tunnel status"]
    runs = ["phone pair", "phone unpair"]
    events = ["phone.*"]
    keys = [PhonesKey, TunnelKey]
