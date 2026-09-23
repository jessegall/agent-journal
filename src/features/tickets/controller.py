import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from features.tickets.resource import Ticket


class Tickets(Controller):
    resource = Ticket

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        source = str(data.pop("source", "") or self.actor)
        known = self._from_source(source, str(data.get("source_id") or ""))
        if known:
            return self.update(known.n, title=title, abstract=abstract or None, brief=brief or None)
        return super().create(title, abstract, brief, source=source, **data)

    def _from_source(self, source: str, source_id: str):
        if not source_id:
            return None
        return next((r for r in self._standing() if r.source == source and r.source_id == source_id), None)


resources_module.register(Ticket)
types_module.register(Tickets)
