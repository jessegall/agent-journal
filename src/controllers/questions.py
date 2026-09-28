import time

from controllers.base import Controller, internal
from resources import types
from resources.base import AGENT, Refused

ANSWERED_BY = "answered_by"
REASON = "reason"
CHOSEN = "chosen"
ANSWERED_SHOWN = 3600
DISMISSED = "Dismissed, so it is not acted on and not asked again"


class Questions(Controller):
    resource = types.Question

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        about = data.get("about")
        waiting = None if self.resource(data=self._shaped(data)).hidden else self._open_about(about)
        if waiting:
            self._refuse(f"{about.replace(':', ' ')} already waits on question {waiting.n}, {waiting.title}: wait for its answer instead of asking again")
        return super().create(title, abstract, brief, **data)

    def _open_about(self, about: str | None):
        return next((q for q in self.about(about) if not q.completed and not q.hidden), None) if about else None

    def dismiss(self, n: int, why: str = ""):
        return self.complete(n, how=f"{DISMISSED}: {why}" if why.strip() else DISMISSED, reason=why, dismissed=True)

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
        chosen = {CHOSEN: self.load(n).chosen_for(outcome), "dismissed": False} if outcome is not None else {}
        return super().update(n, title=title, abstract=abstract, brief=brief, outcome=outcome, **data, **chosen)
