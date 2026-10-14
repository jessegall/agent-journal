import time

from controllers.base import Controller
from resources import types
from resources.base import AGENT, Refused
from resources.types import ANSWERED_BY
from controllers.marks import action

REASON = "reason"
CHOSEN = "chosen"
ANSWERED_SHOWN = 3600
DISMISSED = "Dismissed, so it is not acted on and not asked again"


class Questions(Controller):
    resource = types.Question

    @action
    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        about = data.get("about")
        waiting = None if self._given(data).hidden else self._open_about(about)
        if waiting:
            self._refuse(f"{about.replace(':', ' ')} already waits on question {waiting.n}, {waiting.title}: wait for its answer instead of asking again")
        return super().create(title, abstract, brief, **data)

    def _open_about(self, about: str | None):
        return next((q for q in self.about(about) if not q.completed and not q.hidden), None) if about else None

    @action
    def dismiss(self, n: int, why: str = ""):
        return self.complete(n, how=f"{DISMISSED}: {why}" if why.strip() else DISMISSED, reason=why, dismissed=True)

    def _keep_for_the_user(self, n: int) -> None:
        """A question that names itself the user's alone is answered by the user: an agent, its own or another's, waits for the answer."""
        if self.actor == AGENT and self.load(n).user_only:
            self._refuse(f"question {n} is the user's alone to answer: wait for their answer")

    @action
    def complete(self, n: int, how: str = "", **data):
        self._keep_for_the_user(n)
        if self.actor == AGENT and not self._given(data).reason.strip():
            raise Refused(f'you are answering question {n} yourself: say why with --set reason="<why>"')
        return super().complete(n, how=how, **{**data, "kept": False, ANSWERED_BY: self.actor, CHOSEN: self.load(n).chosen_for(how)})

    def about(self, ref: str) -> list:
        return [r for r in self.rows.kept(closed_since=time.time() - ANSWERED_SHOWN) if ref in r.refs]

    @action
    def update(self, n: int, title: str | None = None, abstract: str | None = None, brief: str | None = None, outcome: str | None = None, **data):
        if outcome is not None:
            self._keep_for_the_user(n)
        chosen = {CHOSEN: self.load(n).chosen_for(outcome), "dismissed": False} if outcome is not None else {}
        return super().update(n, title=title, abstract=abstract, brief=brief, outcome=outcome, **data, **chosen)
