from controllers.base import Controller
from resources import types


class Features(Controller):
    resource = types.FeatureRow

    def switch(self, name: str, on: bool = True):
        row = self._titled(name)
        return self.update(row.n, enabled=bool(on)) if row else self.create(name, enabled=bool(on))

    def on(self, name: str, default: bool = True) -> bool:
        row = self._titled(name)
        return bool(row.enabled) if row else default
