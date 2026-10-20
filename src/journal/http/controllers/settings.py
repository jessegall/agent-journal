from journal.features.registry import Registry
from journal.http.support.request import Request
from journal.support.response import Response
from journal.support.actor import Actor
from journal.repositories.setting_rows import SettingRows

FEATURES = "features"


class SettingController:
    """The settings as the settings page holds them: every option under its feature, nested on the first dot, and every feature's switch under features; a save sends a top whole, so a key it drops goes back to its default."""

    def __init__(self, settings: SettingRows, registry: Registry) -> None:
        self.settings, self.registry = settings, registry

    def index(self, request: Request) -> Response:
        return Response.json(self.tree())

    def store(self, request: Request) -> Response:
        """A change names only the keys it sets, null for one that goes back to its default; the keys it leaves out stay. The page keeps the answer as its whole settings tree, so a change answers with all of it."""
        for top, inner in request.body.items():
            if isinstance(inner, dict):
                self.saved(top, inner, request.actor)
        return Response.json(self.tree())

    def saved(self, top: str, inner: dict, by: Actor) -> None:
        known = {f.name for f in self.registry.features}
        for name, value in inner.items():
            if top == FEATURES and name not in known:
                continue
            if value is None:
                self.settings.unset(f"{top}.{name}", by)
            else:
                self.settings.set(f"{top}.{name}", value, by)

    def tree(self) -> dict:
        return {**self.settings.tree(), FEATURES: {f.name: self.registry.is_on(f) for f in self.registry.features}}
