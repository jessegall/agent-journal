from controllers.base import Controller, internal
from resources import types


class Agents(Controller):
    resource = types.AgentRow

    def by_session(self, session: str):
        return self._titled(session) or self.create(session, status="stopped")

    @internal
    def saw(self, n: int, fact: dict, **data):
        r = self.load(n)
        r.data.update(self._shaped(data))
        return self.save(r, "reported", **fact)

    def primary(self):
        rows = [row for row in self._standing() if not row.parent]
        return max(rows, key=lambda row: float(row.at or 0), default=None)
