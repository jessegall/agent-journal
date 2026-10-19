from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.models.option import Option
from journal.models.setting import Setting
from journal.repositories.scope import PROJECT, Scope
from journal.repositories.scoped_repository import ScopedRepository



class Settings(ScopedRepository[Setting]):
    """Reads a key with the project's value over the environment's; writes to whichever scope is asked."""

    model = Setting

    def __init__(self, connection: Connection, bus: Bus, scope: Scope) -> None:
        super().__init__(connection, bus, scope)
        self._kept: dict[int, list[Setting]] = {}

    def get(self, key: str, default: object = None) -> object:
        """The value the scope's environment sees."""
        return self.merged().get(key, default)

    def project(self, key: str, default: object = None) -> object:
        """The project's own value, the same in every environment."""
        return self.of_project().get(key, default)

    def option(self, option: Option) -> object:
        """An option's value: options are the project's."""
        return self.project(option.key, option.default)

    def set(self, key: str, value: object, by) -> Setting:
        """Writes the project's value of a key, replacing the row it has."""
        found = [s for s in self.project_rows() if s.key == key]
        return self.save(found[0].with_(value=value) if found else Setting(environment_id=PROJECT, key=key, value=value), by)

    def unset(self, key: str, by) -> None:
        """Takes the project's row of a key away, so the default holds again."""
        for row in [s for s in self.project_rows() if s.key == key]:
            self.delete(row, by)

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
        """A scope's settings, read once and kept until a setting is written: every listener asks whether its feature is on, many times a hook."""
        if environment_id not in self._kept:
            self._kept[environment_id] = self.across_environments(environment_id=environment_id)
        return self._kept[environment_id]

    def written(self) -> None:
        """Kept rows go when a setting is written, and again when the write commits: a reader on another thread may have kept what it saw before."""
        self._kept.clear()
        self.connection.after_commit(self._kept.clear)

    def _placed(self, row: Setting) -> Setting:
        """A setting names its own scope: 0 is the project's, laid over every environment."""
        return row
