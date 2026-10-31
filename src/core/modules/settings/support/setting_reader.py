import json
from collections.abc import Generator
from contextlib import contextmanager

from core.modules.settings.support.setting_rows import SettingRows
from core.base.registry.setting_entry import SettingEntry
from core.base.type_guards import is_list
from core.base.setting.setting_value import SettingDefault
from core.modules.settings.models.secret_setting import SecretSetting
from core.modules.settings.models.setting import Setting
from core.modules.settings.support.current_setting import CurrentSetting
from core.modules.settings.support.setting_catalogue import SettingCatalogue

ENVIRONMENT_SOURCE = "environment"
PROJECT_SOURCE = "project"
DEFAULT_SOURCE = "default"
StoredValue = str | int | float | bool | list[object] | None


class SettingReader:
    """The one reader of settings: off when a toggleable group above is switched off, else the value for the
    environment, else for the project, else the declared default; a secret is read from its own table. Inside
    keep_rows(), each row is read once and kept, for a stretch in which nothing writes a setting."""

    def __init__(self, setting_rows: SettingRows, declared: SettingCatalogue) -> None:
        self.setting_rows, self.declared = setting_rows, declared
        self.cache: dict[tuple[str, int | None], StoredValue] | None = None

    @contextmanager
    def keep_rows(self) -> Generator[None]:
        self.cache = {}
        try:
            yield
        finally:
            self.cache = None

    def current(self, key: str, environment_id: int | None) -> CurrentSetting:
        entry = self.declared.entry(key)
        for group in self.declared.enclosing_groups(entry):
            if group.toggleable and self.current(group.key, environment_id).value is False:
                return CurrentSetting(entry, False, f"group {group.key} is off")
        model = SecretSetting if entry.secret else Setting
        if environment_id is not None:
            stored = self.stored(model, key, environment_id)
            if stored is not None:
                return CurrentSetting(entry, stored, ENVIRONMENT_SOURCE)
        stored = self.stored(model, key, None)
        if stored is not None:
            return CurrentSetting(entry, stored, PROJECT_SOURCE)
        return CurrentSetting(entry, self.default(entry), DEFAULT_SOURCE)

    def stored(self, model: type[Setting] | type[SecretSetting], key: str, environment_id: int | None) -> StoredValue:
        address = (f"{model.model_name}:{key}", environment_id)
        if self.cache is not None and address in self.cache:
            return self.cache[address]
        row = self.setting_rows.row(model, key, environment_id)
        value = self.decoded(model, row.value) if row is not None else None
        if self.cache is not None:
            self.cache[address] = value
        return value

    @staticmethod
    def decoded(model: type[Setting] | type[SecretSetting], text: str) -> StoredValue:
        if model is SecretSetting:
            return text
        loaded: object = json.loads(text)
        return loaded if isinstance(loaded, str | int | float | bool) or is_list(loaded) else None

    @staticmethod
    def default(entry: SettingEntry) -> SettingDefault:
        return entry.enabled if entry.toggleable else entry.default
