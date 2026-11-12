import subprocess
from engine.agent.agent_checkouts import AgentCheckouts
from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.module.module_actors import ModuleActors
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.support.runner_binary import RunnerBinary
from core.modules.processes.support.runner_line import RunnerLine
from core.modules.triggers.commands.start_trigger_action.start_trigger_action import StartTriggerAction
from core.modules.triggers.models.support.trigger_extra_action import TriggerExtraAction


class TriggerActionProcess:
    """Starts a trigger action through the journal runner in its chosen folder."""

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, runner: RunnerBinary, checkouts: AgentCheckouts) -> None:
        self.bus, self.actors, self.queries, self.runner, self.checkouts = bus, actors, queries, runner, checkouts

    def start(self, action: TriggerExtraAction, event: LoggedEvent) -> None:
        agent = self.queries.query(Agent).find(event.actor_id)
        process = self.bus.run(StartTriggerAction(event.row_id, agent.id, action), self.actors.actor("journal.core.triggers"), cause_id=event.id, environment_id=agent.environment_id)
        line = RunnerLine.build(self.runner.path, process.id, ForegroundRun(0, True), process.line, agent.session, self.checkouts.checkout(agent.id))
        subprocess.Popen(["sh", "-c", line], cwd=process.folder, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
