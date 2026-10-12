from events import Fact
from events.agents import ClockTicked
from events.awaited import WaitEnded
from receiving import Listener
from resources.runs import CommandRow
from resources.types import AgentRow, Helper, Work
from serving import ReadRows

HELPER = "helper:"
KEPT = 300


def back(ref: str, helpers: ReadRows[Helper], agent: AgentRow) -> str | None:
    """What the thing waited on came to, or None while it is still out."""
    if ref.startswith(HELPER):
        row = helpers.load(int(ref.removeprefix(HELPER)))
        if not row.report and not row.completed:
            return None
        return f"{row.name}: {row.report[:KEPT]}" if row.report else f"{row.name} finished"
    runs = (CommandRow.from_json(row) for row in agent.runs)
    run = next((one for one in runs if one.answers(ref) and not one.running), None)
    return f"{run.named() or ref} {run.came_to()}" if run else None


class SpotEndedWaits(Listener[ClockTicked]):
    def listen(self, event: ClockTicked, works: ReadRows[Work], helpers: ReadRows[Helper], agents: ReadRows[AgentRow]) -> list[Fact]:
        agent = agents.peek(event.agent)
        facts = []
        for work in (w for w in works.rows.standing() if w.awaiting_on and not w.parked):
            found = [back(ref, helpers, agent) for ref in work.awaiting_on.split(",")]
            if None not in found:
                facts.append(WaitEnded(work=work.n, awaiting=work.awaiting, results="; ".join(found), count=len(work.sections)))
        return facts
