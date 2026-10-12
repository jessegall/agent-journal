from events.agents import ClockTicked
from features.helpers.controller import Helpers
from framework.parts import AgentContext, Handler
from resources.base import SYSTEM
from controllers.types import Works
from providers.claude import CommandRow

HELPER = "helper:"
KEPT = 300


def back(context: AgentContext, ref: str) -> str | None:
    if ref.startswith(HELPER):
        row = Helpers(context.record, actor=SYSTEM).load(int(ref.removeprefix(HELPER)))
        if not row.report and not row.completed:
            return None
        return f"{row.name}: {row.report[:KEPT]}" if row.report else f"{row.name} finished"
    runs = (CommandRow.from_json(row) for row in context.agent.row.runs)
    run = next((one for one in runs if one.answers(ref) and not one.running), None)
    return f"{run.named() or ref} {run.came_to()}" if run else None


class ReturnWhenAwaitedReport(Handler):
    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        works = context.journal.get(Works)
        for w in (w for w in works.rows.standing() if w.awaiting_on and not w.parked):
            found = [back(context, ref) for ref in w.awaiting_on.split(",")]
            if None in found:
                continue
            results = "; ".join(found)
            works.section(w.n, f"{len(w.sections) + 1} · back", f"{w.awaiting} came back: {results}")
            works.update(w.n, awaiting="", awaiting_on="")
            context.agent.say("returned", awaiting=w.awaiting, results=results, n=w.n)
