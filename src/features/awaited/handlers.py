from engine.events.engine import ClockTicked
from features.helpers.controller import Helpers
from features.parts import AgentContext, Handler
from resources.base import SYSTEM
from controllers.types import Works

HELPER = "helper:"
KEPT = 300


def back(context: AgentContext, ref: str) -> str | None:
    if ref.startswith(HELPER):
        row = Helpers(context.record, actor=SYSTEM).load(int(ref.removeprefix(HELPER)))
        if not row.report and not row.completed:
            return None
        return f"{row.name}: {row.report[:KEPT]}" if row.report else f"{row.name} finished"
    run = next((run for run in context.agent.row.runs if ref in (run.get("task_id"), run.get("id")) and not run.get("running")), None)
    return f"{run.get('task') or run.get('command') or ref} {run.get('status') or 'ended'}" if run else None


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
