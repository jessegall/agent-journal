import json

from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.registry.setting_entry import SettingEntry
from core.base.setting.setting_value import SettingDefault
from core.modules.settings.models.secret_setting import SecretSetting
from core.modules.settings.models.setting import Setting
from core.modules.settings.support.declared_settings import DeclaredSettings
from core.modules.settings.support.current_setting import CurrentSetting

ENVIRONMENT_SOURCE = "environment"
PROJECT_SOURCE = "project"
DEFAULT_SOURCE = "default"


class DeclaredValues:
    """Reads a declared setting: off when a group above it is switched off, else its value for the environment,
    else for the project, else its declared default; a secret is read from its own table."""

    def __init__(self, queries: Queries, declared: DeclaredSettings) -> None:
        self.queries, self.declared = queries, declared

    def current(self, key: str, environment_id: int | None) -> CurrentSetting:
        entry = self.declared.entry(key)
        for group in self.declared.groups_above(entry):
            if group.toggleable and self.current(group.key, environment_id).value is False:
                return CurrentSetting(entry, False, f"group {group.key} is off")
        model = SecretSetting if entry.secret else Setting
        for environment, source in ((environment_id, ENVIRONMENT_SOURCE), (None, PROJECT_SOURCE)):
            if environment is None and source == ENVIRONMENT_SOURCE:
                continue
            stored = self.stored(model, key, environment)
            if stored is not None:
                return CurrentSetting(entry, stored, source)
        return CurrentSetting(entry, self.default(entry), DEFAULT_SOURCE)

    def stored(self, model: type[Setting] | type[SecretSetting], key: str, environment_id: int | None) -> str | int | float | bool | None:
        query = self.queries.query(model).filter(key=key)
        rows = (query.matching(IsNull("environment_id")) if environment_id is None else query.filter(environment_id=environment_id)).page(1, 1).rows
        if not rows:
            return None
        return rows[0].value if model is SecretSetting else json.loads(rows[0].value)

    @staticmethod
    def default(entry: SettingEntry) -> SettingDefault:
        return entry.enabled if entry.toggleable else entry.default
