from dataclasses import dataclass


@dataclass(frozen=True)
class SyncReport:
    """What a sync found and changed: the modules in their order, the migrations it ran, and whether the
    registry changed."""

    modules: tuple[str, ...]
    migrations: list[str]
    registry_changed: bool
    notes: tuple[str, ...] = ()

    @property
    def text(self) -> str:
        migrations = ", ".join(self.migrations) if self.migrations else "none"
        registry = "rewritten" if self.registry_changed else "unchanged"
        lines = [f"modules: {', '.join(self.modules) or 'none'}", f"migrations run: {migrations}", f"registry: {registry}", *self.notes]
        return "\n".join(lines)
