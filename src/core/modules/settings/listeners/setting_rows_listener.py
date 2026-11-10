from core.base.change.changed import Changed
from core.base.change.deleted import Deleted
from engine.command.context import Context
from core.base.listener.save_listener import SaveListener
from core.modules.settings.models.setting import Setting
from core.modules.settings.models.secret_setting import SecretSetting
from core.modules.settings.support.setting_rows import SettingRows


class SettingRowsListener(SaveListener[Changed[Setting] | Changed[SecretSetting]]):
    name = "settings.saved-rows"

    def __init__(self, rows: SettingRows) -> None:
        self.rows = rows

    def handle(self, event: Changed[Setting] | Changed[SecretSetting], context: Context) -> None:
        if isinstance(event, Deleted):
            self.rows.remove(event.row)
            return
        self.rows.remember(event.row)
