from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.tool_starting import ToolStarting
from journal.features.agent_listener import AgentListener
from journal.features.tasks.states.working import Working
from journal.hooks.decision import Decision
from journal.repositories.settings import PROJECT, Settings

NUDGE_AFTER, HOLD_AFTER = "tasks.log_nudge_after", "tasks.log_hold_after"
"""The settings: tool uses with nothing logged before the agent is asked to log, ten unless set, and before the next write waits for a log, twenty unless set."""
DEFAULTS = {NUDGE_AFTER: 10, HOLD_AFTER: 20}


class LogCadence(AgentListener[ToolStarting]):
    """Work in hand is logged as it goes: after ten tool uses with nothing logged the agent is asked to, and after twenty the next write waits for the log line."""

    blocking = True

    def __init__(self, machine: Machine, nudger: Nudger, settings: Settings) -> None:
        self.machine, self.nudger, self.settings = machine, nudger, settings

    def handle(self, event: ToolStarting) -> Decision | None:
        from journal.features.tasks.feature import Tasks
        agent = self.machine.agent(event.session, event.environment_id)
        state = self.machine.states.named(agent.state, agent.data)
        if not isinstance(state, Working):
            return None
        # the machine counted this use already; what matters is how many came before it
        before = state.uses - 1
        if before >= self.after(HOLD_AFTER) and event.writes:
            return Decision.refuse(Tasks.LOG_OVERDUE.about(n=state.task_id, uses=before).rendered())
        if before < self.after(NUDGE_AFTER):
            return None
        line = self.nudger.say(agent, Tasks.LOG_SOON.about(n=state.task_id, uses=before))
        return Decision.tell(line) if line else None

    def after(self, setting: str) -> int:
        return int(self.settings.get(PROJECT, setting, DEFAULTS[setting]))
