from engine.viewer.window import Window
from core.modules.secrets.support.skeletons import SECRETS_SECRETS_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from core.modules.secrets.windows.secrets.keys.secrets_key import SecretsKey


class SecretsWindow(Window):
    """The Secrets window."""

    name = "secrets.secrets"
    title = "Secrets"
    entry = "secrets.js"
    loading = WindowLoading.COMPONENT
    skeleton = SECRETS_SECRETS_SKELETON
    place = WindowPlace.PAGE
    group = "project"
    icon = WindowIcon.HASH
    reads = ["secret list", "secret show"]
    count = "secret list"
    runs = ["secret fill", "secret allow", "secret make", "secret update", "secret delete"]
    events = ["secret.*"]
    keys = [SecretsKey]
