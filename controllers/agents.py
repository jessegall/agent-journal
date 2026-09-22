import time

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

    def stop_task(self, n: int, task: str, what: str = ""):
        if not task.strip():
            self._refuse("name the task to stop")
        return self.update(int(n), stopping={"task": task.strip(), "what": what.strip() or task.strip(), "at": time.time()})

    def primary(self):
        rows = [row for row in self._standing() if not row.parent]
        return max(rows, key=lambda row: float(row.at or 0), default=None)
