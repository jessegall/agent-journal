from journal.features.registry import Registry
from journal.models.actor import Actor
from journal.repositories.settings import Settings


class V3Settings:
    """The settings tree version 3's viewer shows, built from version 4's own: every feature's switch under features, and every option under its feature, nested on the first dot."""

    def __init__(self, settings: Settings, registry: Registry) -> None:
        self.settings, self.registry = settings, registry

    def tree(self) -> dict:
        tree = self.settings.tree()
        tree["features"] = {f.name: self.registry.is_on(f) for f in self.registry.features}
        return tree

    def save(self, values: dict, by: Actor) -> None:
        """What the viewer sends for a top is that top whole, with the defaults left out: a key it drops goes back to its default."""
        stored = self.settings.project_tree()
        for top, inner in values.items():
            if not isinstance(inner, dict):
                continue
            for name in set(stored.get(top, {})) - set(inner):
                self.settings.unset(f"{top}.{name}", by)
            for name, value in inner.items():
                if top != "features" or name in self.known:
                    self.settings.set(f"{top}.{name}", value, by)

    @property
    def known(self) -> set[str]:
        return {f.name for f in self.registry.features}
