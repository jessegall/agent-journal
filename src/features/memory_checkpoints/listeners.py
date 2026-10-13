from events import Fact
from events.agents import AgentChanged, AgentReported
from events.memory_checkpoints import AgentKeptSomething, ContextDecided, ContextMarkReached
from events.resources import ResourceCreated
from receiving import Listener
from resources.base import AGENT
from resources.types import TYPES, AgentRow, Fact as FactRow, Reminder, Rule
from serving import ReadRows

DECISIONS = ("fact", "rule")
MARKED = {"fact": "Wrote a fact", "rule": "Wrote a rule", "reminder": "Set a reminder"}


def at_a_mark(agent: AgentRow) -> list[Fact]:
    if agent.decided:
        return [ContextDecided(agent=agent.n)]
    return [ContextMarkReached(agent=agent.n, percent=int(agent.context)).due()]


class DecideAtMarks(Listener[AgentReported]):
    def listen(self, event: AgentReported, agents: ReadRows[AgentRow]) -> list[Fact]:
        return at_a_mark(agents.peek(event.agent))


class DecideAtMarksOnChange(Listener[AgentChanged]):
    def listen(self, event: AgentChanged, agents: ReadRows[AgentRow]) -> list[Fact]:
        return at_a_mark(agents.peek(event.agent)) if event.action == "updated" else []


class SpotDecision(Listener[ResourceCreated]):
    def listen(self, event: ResourceCreated, agents: ReadRows[AgentRow]) -> list[Fact]:
        agent = agents.primary_to_read()
        return [ContextDecided(agent=agent.n)] if agent and event.type in DECISIONS else []


class SpotWhatWasKept(Listener[ResourceCreated]):
    def listen(self, event: ResourceCreated, agents: ReadRows[AgentRow], facts: ReadRows[FactRow], rules: ReadRows[Rule], reminders: ReadRows[Reminder]) -> list[Fact]:
        agent = agents.primary_to_read()
        if not agent or event.type not in MARKED or event.actor != AGENT:
            return []
        kept = {"fact": facts, "rule": rules, "reminder": reminders}[event.type].peek(event.n)
        return [AgentKeptSomething(agent=agent.n, label=MARKED[event.type], icon=TYPES[event.type].icon, detail=kept.title, ref=kept.ref)]
