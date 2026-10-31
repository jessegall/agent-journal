import json

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.modules.settings.setting import Setting
from core.modules.settings.setting_store import SettingStore
from core.modules.viewer.window_setting_save import WindowSettingSave
from core.modules.viewer.window_setting_key import window_setting_key


class WindowSettingSaveHandler(Handler[WindowSettingSave, Setting]):
    """Writes a window's own setting under viewer.window.<window>.<key> in the caller's environment."""

    command = WindowSettingSave

    def __init__(self, store: SettingStore) -> None:
        self.store = store

    def handle(self, command: WindowSettingSave, context: Context) -> Setting:
        if context.environment_id is None:
            raise Refusal("a window's settings belong to an environment", "name one with --environment")
        return self.store.write(window_setting_key(command.window, command.key), json.loads(command.value), context.environment_id, context)
