import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller, internal
from features.boards.controller import Boards
from features.tickets.resource import Ticket
from resources.base import Refused, Resource


class Tickets(Controller):
    resource = Ticket

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        source = data.pop("source", None) or self.actor
        known = self._from_source(source, data.get("source_id"))
        if known:
            return self.update(known.n, title=title, abstract=abstract or None, brief=brief or None)
        opening = self._stages(data.get("board"))[:1]
        return super().create(title, abstract, brief, source=source, **dict(zip(["stage"], opening)), **data)

    @internal
    def save(self, r: Resource, action: str, **event) -> Resource:
        if r.board and r.stage not in self._stages(r.board):
            raise Refused(f"board {r.board} has no stage {r.stage!r}")
        return super().save(r, action, **event)

    def move(self, n: int, stage: str):
        return self.update(int(n), stage=stage.strip())

    def _stages(self, board) -> list:
        return Boards(self.record, actor=self.actor).load(int(board)).stages if board else []

    def _from_source(self, source: str, source_id: str | None):
        if not source_id:
            return None
        return next((r for r in self._standing() if r.source == source and r.source_id == source_id), None)


resources_module.register(Ticket)
types_module.register(Tickets)
