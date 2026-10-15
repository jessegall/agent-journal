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
from journal.features.chart.context import Context
from journal.features.chart.fillers import Fillers
from journal.features.chart.walk import Walk
from journal.refused import Refused
from journal.repositories.agents import Agents

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


class Trial:
    """A dry walk of the chart for an agent event, about the live agent of an environment: the path it would take and what it would do, nothing done."""

    def __init__(self, walk: Walk, fillers: Fillers, agents: Agents) -> None:
        self.walk, self.fillers, self.agents = walk, fillers, agents

    def run(self, trigger: str, environment_id: int) -> dict:
        if trigger not in EVENTS:
            raise Refused(f"a trial stands in for an agent event: one of {', '.join(EVENTS)}")
        agent = self.agents.live(environment_id)
        session = agent.session if agent else ""
        ctx = Context(event=EVENTS[trigger](session, environment_id), session=session, environment_id=environment_id, provider=(agent.provider or "claude") if agent else "claude", answers_hook=True)
        passed: list[int] = []
        decision = self.walk.dry(self.fillers).on_with_trace(ctx, passed)
        return {"trigger": trigger, "nodes": passed, "would": [line for line in decision.context.split("\n") if line]}
