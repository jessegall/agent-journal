from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.tool_starting import ToolStarting
from journal.features.agent_listener import AgentListener
from journal.features.option import Option
from journal.features.tasks.states.working import Working
from journal.hooks.decision import Decision
from journal.repositories.settings import Settings



class LogCadence(AgentListener[ToolStarting]):
    """Work is logged as it goes, counted in edits as version 3 counted it: the first ask after five, the work named back every ten so drift is noticed, and at twenty the next write waits for the log line."""

    blocking = True

    def __init__(self, machine: Machine, nudger: Nudger, settings: Settings) -> None:
        self.machine, self.nudger, self.settings = machine, nudger, settings

    def handle(self, event: ToolStarting) -> Decision | None:
        from journal.features.tasks.feature import Tasks
        if not event.writes:
            return None
        agent = self.machine.agent(event.session, event.environment_id)
        state = self.machine.states.named(agent.state, agent.data)
        if not isinstance(state, Working):
            return None
        # the machine counted this write already; what matters is how many came before it
        before = state.edits - 1
        if before >= self.after(Tasks.LOG_AFTER):
            return Decision.refuse(Tasks.LOG_OVERDUE.about(name=state.named(), edits=before, log=self.log_of(state)).rendered())
        said = None
        if before == self.after(Tasks.FIRST_AFTER):
            said = Tasks.LOG_SOON.about(name=state.named(), edits=before, log=self.log_of(state))
        elif before and before % self.after(Tasks.NAME_EVERY) == 0:
            said = Tasks.IN_HAND.about(name=state.named(), edits=before)
        line = self.nudger.say(agent, said) if said else None
        return Decision.tell(line) if line else None

    @staticmethod
    def log_of(state: Working) -> str:
        return f"journal task log {state.task_id}" if state.task_id else "journal work log"

    def after(self, option: Option) -> int:
        return int(self.settings.option(option))
