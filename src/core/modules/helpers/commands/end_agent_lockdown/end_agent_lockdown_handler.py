from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.agents.commands.end_agent_halt.end_agent_halt import EndAgentHalt
from core.modules.agents.support.agent_rows import AgentRows
from engine.repository.repository import Repository
from core.modules.drivers.support.helper_job_rows import HelperJobRows
from engine.driver.nudger import Nudger
from core.modules.helpers.commands.end_agent_lockdown.end_agent_lockdown import EndAgentLockdown
from core.modules.helpers.support.helper_nudges import LOCKDOWN_ENDED

LOCKDOWN_SOURCE = "helpers.lockdown-ended"


class EndAgentLockdownHandler(Handler[EndAgentLockdown, None]):
    """Clears the agent's halt and sends it one line to go on; an agent that was never stopped gets nothing. The
    time it was stopped is added to its open job, so the job's time limit leaves it out."""

    command = EndAgentLockdown

    def __init__(self, agents: AgentRows, bus: Bus, nudger: Nudger, jobs: HelperJobRows, repository: Repository) -> None:
        self.agents, self.bus, self.nudger, self.jobs, self.repository = agents, bus, nudger, jobs, repository

    def handle(self, command: EndAgentLockdown, context: Context) -> None:
        halted_at = self.agents.find(command.agent_id).halted_at
        if halted_at is None:
            return
        job = self.jobs.open_job(command.agent_id)
        if job is not None:
            self.repository.save(job.changed(halted_seconds=job.halted_seconds + halted_at.elapsed_seconds(context.timestamp)), context)
        self.bus.dispatch(EndAgentHalt(command.agent_id), context)
        self.nudger.send(command.agent_id, LOCKDOWN_ENDED, LOCKDOWN_SOURCE, context)
