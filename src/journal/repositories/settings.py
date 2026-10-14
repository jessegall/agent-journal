from journal.models.setting import Setting
from journal.repositories.scoped_repository import ScopedRepository

PROJECT = 0


class Settings(ScopedRepository[Setting]):
    """Reads a key with the project's value over the environment's; writes to whichever scope is asked."""

    model = Setting

    def get(self, environment_id: int, key: str, default: object = None) -> object: ...

    def merged(self, environment_id: int) -> dict: ...
