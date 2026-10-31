from dataclasses import dataclass


@dataclass(frozen=True)
class SyncReport:
    """What a sync found and changed: the modules in their order, the migrations it ran, and whether the
    registry changed."""

    modules: tuple[str, ...]
    migrations: list[str]
    registry_changed: bool

    @property
    def text(self) -> str:
        migrations = ", ".join(self.migrations) if self.migrations else "none"
        registry = "rewritten" if self.registry_changed else "unchanged"
        return f"modules: {', '.join(self.modules) or 'none'}\nmigrations run: {migrations}\nregistry: {registry}"
