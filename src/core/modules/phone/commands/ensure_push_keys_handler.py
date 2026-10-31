from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.phone.commands.ensure_push_keys import EnsurePushKeys
from core.modules.phone.commands.push_key_pair import PushKeyPair
from core.modules.phone.support.push_keys import PushKeys
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.settings.commands.support.setting_store import SettingStore

PRIVATE_KEY = "journal.core.phone.push-private-key"
PUBLIC_KEY = "journal.core.phone.push-public-key"


class EnsurePushKeysHandler(Handler[EnsurePushKeys, PushKeyPair]):
    """Reads the push key pair from its two secret settings; when they are not set it makes a pair and keeps both, so
    every later need gives the same keys."""

    command = EnsurePushKeys

    def __init__(self, values: SettingValues, store: SettingStore) -> None:
        self.values, self.store = values, store

    def handle(self, command: EnsurePushKeys, context: Context) -> PushKeyPair:
        secret, public = self.values.value(PRIVATE_KEY, None), self.values.value(PUBLIC_KEY, None)
        if isinstance(secret, str) and isinstance(public, str):
            return PushKeyPair(secret, public)
        keys = PushKeys.made()
        self.store.write_secret(PRIVATE_KEY, keys.text, None, context)
        self.store.write_secret(PUBLIC_KEY, keys.public_text, None, context)
        return PushKeyPair(keys.text, keys.public_text)
