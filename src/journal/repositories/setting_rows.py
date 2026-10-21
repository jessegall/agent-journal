from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.support.option import Option
from journal.support.wrong_setting_kind import WrongSettingKind
from journal.models.setting import Setting
from journal.repositories.scope import PROJECT, Scope
from journal.repositories.scoped_repository import ScopedRepository



class SettingRows(ScopedRepository[Setting]):
    """Reads a key with the project's value over the environment's, each scope's values kept until a setting is written; writes to whichever scope is asked."""

    model = Setting

    def __init__(self, connection: Connection, bus: Bus, scope: Scope) -> None:
        super().__init__(connection, bus, scope)
        self._kept: dict[int, list[Setting]] = {}
        self._values: dict[int, dict[str, object]] = {}

    def get(self, key: str, default: object = None) -> object:
        return self.merged().get(key, default)

    def project(self, key: str, default: object = None) -> object:
        return self.project_values().get(key, default)

    def option(self, option: Option) -> object:
        return self.project(option.key, option.default)

    def mapping(self, key: str) -> dict:
        value = self.project(key, {})
        if not isinstance(value, dict):
            raise WrongSettingKind(key, value)
        return value

    def texts(self, option: Option) -> tuple[str, ...]:
        return option.texts(self.option(option))

    def integer(self, option: Option) -> int:
        return option.integer(self.option(option))

    def decimal(self, option: Option) -> float:
        return option.decimal(self.option(option))

    def set(self, key: str, value: object, actor) -> Setting:
        rows = [s for s in self.project_rows() if s.key == key]
        return self.save((rows[0] if rows else Setting(environment_id=PROJECT, key=key)).with_value(value, self._time().timestamp()), actor)

    def unset(self, key: str, actor) -> None:
        for row in [s for s in self.project_rows() if s.key == key]:
            self.delete(row, actor)

    def tree(self) -> dict:
        return self.nested(self.merged())

    def project_tree(self) -> dict:
        return self.nested(self.project_values())

    @staticmethod
    def nested(values: dict) -> dict:
        tree: dict = {}
        for key, value in values.items():
            top, name = key.split(".", 1) if "." in key else (key, "")
            tree.setdefault(top, {})[name] = value
        return tree

    def merged(self) -> dict:
        return self.values(self.scope.id)

    def project_values(self) -> dict:
        return self.values(PROJECT)

    def values(self, environment_id: int) -> dict:
        if environment_id not in self._values:
            environment_values = {setting.key: setting.value for setting in self.environment_rows(environment_id)}
            self._values[environment_id] = environment_values if environment_id == PROJECT else environment_values | self.project_values()
        return self._values[environment_id]

    def project_rows(self) -> list[Setting]:
        return self.environment_rows(PROJECT)

    def environment_rows(self, environment_id: int) -> list[Setting]:
        if environment_id not in self._kept:
            self._kept[environment_id] = self.global_matching(environment_id=environment_id)
        return self._kept[environment_id]

    def stored(self) -> None:
        self.clear_cache()
        self.connection.commit_callback(self.clear_cache)

    def clear_cache(self) -> None:
        self._kept.clear()
        self._values.clear()

    def _placed(self, row: Setting) -> Setting:
        return row
