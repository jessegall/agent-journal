from journal.features.option import Option
from journal.models.setting import Setting
from journal.repositories.scoped_repository import ScopedRepository

PROJECT = 0


class Settings(ScopedRepository[Setting]):
    """Reads a key with the project's value over the environment's; writes to whichever scope is asked."""

    model = Setting

    def get(self, environment_id: int, key: str, default: object = None) -> object:
        return self.merged(environment_id).get(key, default)

    def option(self, environment_id: int, option: Option) -> object:
        return self.get(environment_id, option.key, option.default)

    def set(self, key: str, value: object, by) -> Setting:
        """Writes the project's value of a key, replacing the row it has."""
        found = [s for s in self.in_(PROJECT) if s.key == key]
        return self.save(found[0].with_(value=value) if found else Setting(environment_id=PROJECT, key=key, value=value), by)

    def unset(self, key: str, by) -> None:
        """Takes the project's row of a key away, so the default holds again."""
        for row in [s for s in self.in_(PROJECT) if s.key == key]:
            self.delete(row, by)

    def tree(self, environment_id: int) -> dict:
        """Every setting as the environment sees it, nested on the first dot: tasks.log_after is tree["tasks"]["log_after"]."""
        tree: dict = {}
        for key, value in self.merged(environment_id).items():
            top, name = key.split(".", 1) if "." in key else (key, "")
            tree.setdefault(top, {})[name] = value
        return tree

    def merged(self, environment_id: int) -> dict:
        merged = {s.key: s.value for s in self.in_(environment_id)}
        merged.update({s.key: s.value for s in self.in_(PROJECT)})
        return merged
