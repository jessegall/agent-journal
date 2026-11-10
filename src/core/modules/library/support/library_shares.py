from engine.container.container import Container
from core.base.library.library_share import LibraryShare
from core.base.model.model import Model
from engine.errors.refusal import Refusal
from core.base.registry.registry import Registry


class LibraryShares:
    """The ways of sharing rows that installed modules declare, found by their name on the server through the
    registry."""

    def __init__(self, registry: Registry, container: Container) -> None:
        self.registry, self.container = registry, container

    def lookup(self, name: str) -> LibraryShare[Model]:
        if name not in self.registry.library_shares:
            raise Refusal(f"this journal shares no {name} with the library", f"the shares are {', '.join(sorted(self.registry.library_shares)) or 'none'}")
        share_class: type[LibraryShare[Model]] = self.registry.library_shares[name].checked_class(LibraryShare)
        return self.container.get(share_class)
