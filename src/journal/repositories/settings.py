from journal.models.option import Option
from journal.models.setting import Setting
from journal.repositories.scoped_repository import ScopedRepository

PROJECT = 0


class Settings(ScopedRepository[Setting]):
    """Reads a key with the project's value over the environment's; writes to whichever scope is asked."""

    model = Setting

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
        return {**{s.key: s.value for s in self.in_()}, **self.of_project()}

    def of_project(self) -> dict:
        return {s.key: s.value for s in self.project_rows()}

    def project_rows(self) -> list[Setting]:
        return self.where(environment_id=PROJECT)

    def _placed(self, row: Setting) -> Setting:
        """A setting names its own scope: 0 is the project's, laid over every environment."""
        return row
