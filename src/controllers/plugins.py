from controllers.base import Controller
from resources import types


class Plugins(Controller):
    resource = types.Plugin

    def raise_moment(self, n: int, moment: str, **data) -> None:
        """Announces something a plugin did, as the plugin. A plugin's own events reach the journal only here, so the one funnel that owns the type is the one that says they happened."""
        self._emit(n, moment, **data)

    def _installed(self) -> list:
        return [r for r in self.rows.standing() if r.enabled and r.manifest]
