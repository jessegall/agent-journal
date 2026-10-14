from journal.models.setting import Setting
from journal.repositories.scoped_repository import ScopedRepository

PROJECT = 0


class Settings(ScopedRepository[Setting]):
    """Reads a key with the project's value over the environment's; writes to whichever scope is asked."""

    model = Setting

    def get(self, environment_id: int, key: str, default: object = None) -> object:
        return self.merged(environment_id).get(key, default)

    def merged(self, environment_id: int) -> dict:
        merged = {s.key: s.value for s in self.in_(environment_id)}
        merged.update({s.key: s.value for s in self.in_(PROJECT)})
        return merged
