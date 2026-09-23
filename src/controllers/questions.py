from controllers.base import Controller
from resources import types
from resources.base import AGENT, Refused

ANSWERED_BY = "answered_by"
REASON = "reason"
CHOSEN = "chosen"


class Questions(Controller):
    resource = types.Question

    def complete(self, n: int, how: str = "", **data):
        if self.actor == AGENT and not self.resource(data=self._shaped(data)).reason.strip():
            raise Refused(f'you are answering question {n} yourself: say why with --set reason="<why>"')
        return super().complete(n, how=how, **{**data, "kept": False, ANSWERED_BY: self.actor, CHOSEN: self.load(n).chosen_for(how)})

    def update(self, n: int, title: str | None = None, abstract: str | None = None, brief: str | None = None, outcome: str | None = None, **data):
        chosen = {CHOSEN: self.load(n).chosen_for(outcome)} if outcome is not None else {}
        return super().update(n, title=title, abstract=abstract, brief=brief, outcome=outcome, **data, **chosen)
