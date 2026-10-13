from events.answers import Allowed, Answer, Rewritten
from events.asking import HookResponding
from framework.held_lines import held
from payload import HookEvent
from receiving import Answerer
from serving import ReadElsewhere


class HandOverHeldLines(Answerer[HookResponding]):
    """What the agent's tags did, handed over on the hook's own answer."""

    def answer(self, request: HookResponding, elsewhere: ReadElsewhere) -> Answer:
        lines = held(elsewhere.here().record, request.session) if request.event == HookEvent.PRE_TOOL_USE else []
        return Rewritten("".join(f"[journal] {line}\n" for line in lines)) if lines else Allowed()
