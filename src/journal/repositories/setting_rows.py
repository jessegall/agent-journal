from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.support.option import Option
from journal.models.setting import Setting
from journal.support.scope import PROJECT, Scope
from journal.repositories.scoped_repository import ScopedRepository



class SettingRows(ScopedRepository[Setting]):
    """Reads a key with the project's value over the environment's; writes to whichever scope is asked."""

    model = Setting

    def __init__(self, connection: Connection, bus: Bus, scope: Scope) -> None:
        super().__init__(connection, bus, scope)
        self._kept: dict[int, list[Setting]] = {}

    def get(self, key: str, default: object = None) -> object:
        return self.merged().get(key, default)

    def project(self, key: str, default: object = None) -> object:
        return self.of_project().get(key, default)

    def option(self, option: Option) -> object:
        return self.project(option.key, option.default)

    def set(self, key: str, value: object, actor) -> Setting:
        found = [s for s in self.project_rows() if s.key == key]
        return self.save((found[0] if found else Setting(environment_id=PROJECT, key=key)).set_to(value, self._now().timestamp()), actor)

    def unset(self, key: str, actor) -> None:
        for row in [s for s in self.project_rows() if s.key == key]:
            self.delete(row, actor)

    def tree(self) -> dict:
        """Every setting as the environment sees it, nested on the first dot: tasks.log_after is tree["tasks"]["log_after"]."""
        return self.nested(self.merged())

    def project_tree(self) -> dict:
        return self.nested(self.of_project())

    @staticmethod
    def nested(values: dict) -> dict:
        tree: dict = {}
        for key, value in values.items():
            top, name = key.split(".", 1) if "." in key else (key, "")
            tree.setdefault(top, {})[name] = value
        return tree

    def merged(self) -> dict:
        return {**{s.key: s.value for s in self.rows_of(self.scope.id)}, **self.of_project()}

    def of_project(self) -> dict:
        return {s.key: s.value for s in self.project_rows()}

    def project_rows(self) -> list[Setting]:
        return self.rows_of(PROJECT)

    def rows_of(self, environment_id: int) -> list[Setting]:
        if environment_id not in self._kept:
            self._kept[environment_id] = self.across_environments(environment_id=environment_id)
        return self._kept[environment_id]

    def written(self) -> None:
        self._kept.clear()
        self.connection.after_commit(self._kept.clear)

    def _placed(self, row: Setting) -> Setting:
        return row
