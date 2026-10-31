from core.base.module.module import Module


class SyncNotes:
    """What a sync tells besides what it changed, about rows no module covers; it tells nothing until a module binds
    notes of its own."""

    def lines(self, modules: tuple[type[Module], ...]) -> list[str]:
        return []
