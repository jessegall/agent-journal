from journal.engine.machine import Machine
from journal.events.agent.compacting import Compacting
from journal.events.agent.idle import Idle
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.events.agent.session_ended import SessionEnded
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.subagent_ended import SubagentEnded
from journal.events.agent.subagent_started import SubagentStarted
from journal.events.agent.ticked import Ticked
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent.turn_written import TurnWritten
from journal.events.models.created import Created
from journal.events.models.updated import Updated
from journal.features.chart.assumed_checks import AssumedChecks
from journal.features.chart.assumptions import Assumptions
from journal.features.chart.checks import Checks
from journal.features.chart.context import Context
from journal.features.chart.fillers import Fillers
from journal.features.chart.walk import Walk
from journal.models.actor import Actor
from journal.models.worker_state import WorkerState

TICK_QUIET = 3600.0
"""The quiet a tick trial stands in when none is given: long enough for every shipped quiet check to pass, so the trial shows what a tick does."""
from dataclasses import replace

from journal.providers.providers import Providers
from journal.refused import Refused
from journal.repositories.agents import Agents
from journal.repositories.messages import Messages
from journal.repositories.questions import Questions
from journal.repositories.scope import Scope
from journal.repositories.workers import Workers

EVENTS = {
    "session_started": lambda s, e: SessionStarted(session=s, environment_id=e, source="startup"),
    "prompt_submitted": lambda s, e: PromptSubmitted(session=s, environment_id=e, prompt=""),
    "tool_starting": lambda s, e: ToolStarting(session=s, environment_id=e, tool="Edit", input={"file_path": "a file"}),
    "tool_finished": lambda s, e: ToolFinished(session=s, environment_id=e, tool="Edit", input={}, output=""),
    "idle": lambda s, e: Idle(session=s, environment_id=e),
    "turn_written": lambda s, e: TurnWritten(session=s, environment_id=e, text="", final=True),
    "subagent_started": lambda s, e: SubagentStarted(session=s, environment_id=e, subagent=""),
    "subagent_ended": lambda s, e: SubagentEnded(session=s, environment_id=e, subagent=""),
    "compacting": lambda s, e: Compacting(session=s, environment_id=e),
    "session_ended": lambda s, e: SessionEnded(session=s, environment_id=e),
    "ticked": lambda s, e: Ticked(session=s, environment_id=e, at=0.0, quiet_for=0.0),
}
"""An agent event of each kind as a trial stands it in: a tool starting is an edit of a file, so a hold on writes shows."""

BEFORE = {"messages": lambda m: m, "workers": lambda w: w.with_(state=WorkerState.DISPATCHED), "questions": lambda q: q.with_(answer=None)}
"""The rows a trial can stand a row event in for, each with the row as it stood before the change the event means: a worker dispatched, a question unanswered."""


class Trial:
    """A dry walk of the chart for an agent event, about the live agent of an environment: the path it would take and what it would do, nothing done."""

    def __init__(self, walk: Walk, fillers: Fillers, agents: Agents, messages: Messages, workers: Workers, questions: Questions, checks: Checks, machine: Machine, providers: Providers, scope: Scope) -> None:
        self.repositories = {"messages": messages, "workers": workers, "questions": questions}
        self.checks, self.machine, self.providers = checks, machine, providers
        self.walk, self.fillers, self.agents, self.scope = walk, fillers, agents, scope

    def run(self, trigger: str, environment_id: int, row: int = 0, assumptions: Assumptions = Assumptions()) -> dict:
        """A dry run for an agent event, or for a row event given the row, against the live rows or the state assumed: the path and what it would do, nothing done."""
        with self.scope.of(environment_id):
            return self.dry_run(trigger, environment_id, row, assumptions)

    def dry_run(self, trigger: str, environment_id: int, row: int, assumptions: Assumptions) -> dict:
        agent = self.agents.live()
        session = agent.session if agent else ""
        provider = assumptions.provider or ((agent.provider or "claude") if agent else "claude")
        state = self.state_for(agent, assumptions)
        if trigger in EVENTS:
            event = EVENTS[trigger](session, environment_id)
            if isinstance(event, Ticked):
                assumptions = replace(assumptions, quiet=assumptions.quiet if assumptions.quiet is not None else TICK_QUIET)
                event = Ticked(session=session, environment_id=environment_id, at=0.0, quiet_for=assumptions.quiet)
            if isinstance(event, ToolStarting):
                event = replace(event, tool=sorted(self.providers.named(provider).write_tools)[0], provider=provider)
            ctx = Context(event=event, session=session, environment_id=environment_id, provider=provider, answers_hook=True, state=state)
        else:
            ctx = Context(event=self.row_event(trigger, row), session=session, environment_id=environment_id, provider=provider, state=state)
        passed: list[int] = []
        ledger: dict = {}
        decision = self.walk.dry(self.fillers, AssumedChecks(self.checks, assumptions, ledger), ledger).on_with_trace(ctx, passed)
        return {"trigger": trigger, "row": row, "state": state.name if state else "", "nodes": passed, "would": [line for line in decision.context.split("\n") if line], "assumed": assumptions.described(),
                "workflows": list(ctx.walked), "read": {str(k): v for k, v in ctx.read.items()}, "stopped_at": ctx.stopped[0] if ctx.stopped else 0}

    def state_for(self, agent, assumptions: Assumptions):
        """The live agent's state, or the state assumed: with the live agent's data when it is in that state, else the state with nothing in hand."""
        if assumptions.state is None:
            return self.machine.states.named(agent.state, agent.data) if agent else None
        if not self.machine.states.known(assumptions.state):
            raise Refused(f"no state is called {assumptions.state}: one of {', '.join(self.machine.states.names())}")
        data = agent.data if agent and agent.state == assumptions.state else {}
        return self.machine.states.named(assumptions.state, data)

    def stands_in_for(self, trigger: str) -> bool:
        """Whether a trial can stand in for the event: any agent event, or a row event of a table it holds a row of, created or updated."""
        table, _, moment = trigger.partition(".")
        return trigger in EVENTS or (table in self.repositories and moment in ("created", "updated"))

    def row_event(self, trigger: str, row: int):
        """A row event stood in for the row named: created as it is, or updated from how it stood before the change the event means."""
        table, _, moment = trigger.partition(".")
        if table not in self.repositories or moment not in ("created", "updated"):
            raise Refused(f"a trial stands in for an agent event, one of {', '.join(EVENTS)}, or a row event: messages.created, workers.updated or questions.updated, with --row <n>")
        if not row:
            raise Refused(f"a trial of {trigger} needs the row: --row <n>")
        found = self.repositories[table].find(row)
        if moment == "created":
            return Created(model=found, by=Actor.system())
        return Updated(model=found, by=Actor.system(), was=BEFORE[table](found))
