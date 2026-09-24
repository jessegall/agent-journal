import time

from controllers.base import Controller, internal
from resources import types
from resources.base import AGENT, Refused

ANSWERED_BY = "answered_by"
REASON = "reason"
CHOSEN = "chosen"
ANSWERED_SHOWN = 3600


class Questions(Controller):
    resource = types.Question

    def complete(self, n: int, how: str = "", **data):
        if self.actor == AGENT and not self.resource(data=self._shaped(data)).reason.strip():
            raise Refused(f'you are answering question {n} yourself: say why with --set reason="<why>"')
        return super().complete(n, how=how, **{**data, "kept": False, ANSWERED_BY: self.actor, CHOSEN: self.load(n).chosen_for(how)})

    def _standing(self, closed_since: float = 0, closed_last: int = 0) -> list:
        return [r for r in super()._standing(closed_since, closed_last) if not r.hidden]

    @internal
    def about(self, ref: str) -> list:
        return [r for r in super()._standing(closed_since=time.time() - ANSWERED_SHOWN) if ref in r.refs]

    def update(self, n: int, title: str | None = None, abstract: str | None = None, brief: str | None = None, outcome: str | None = None, **data):
        chosen = {CHOSEN: self.load(n).chosen_for(outcome)} if outcome is not None else {}
        return super().update(n, title=title, abstract=abstract, brief=brief, outcome=outcome, **data, **chosen)
