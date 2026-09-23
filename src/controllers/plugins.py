from controllers.base import Controller
from resources import types


class Plugins(Controller):
    resource = types.Plugin

    def _installed(self) -> list:
        return [r for r in self._standing() if r.enabled and r.manifest]
