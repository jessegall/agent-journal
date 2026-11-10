from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from core.modules.agents.support.agent_rows import AgentRows
from suites.coding.modules.workers.commands.end_gone_worker.end_gone_worker import EndGoneWorker
from suites.coding.modules.workers.support.gone_agents import GoneAgents
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry
from suites.coding.support.coding_helper_role import CodingHelperRole


class GoneWorkerRecovery:
    """As the server starts, once: ends each open worker whose recorded process is gone, and resumes at once each
    worker that has a job or started work, instead of waiting for the next agent tick and the retry after it."""

    def __call__(self, container: Container) -> None:
        workers = [agent for agent in container.get(AgentRows).running() if agent.role == CodingHelperRole.WORKER and agent.halted_at is None]
        missing = container.get(GoneAgents).find(workers)
        bus = container.get(Bus)
        for missing_agent in missing:
            bus.run(EndGoneWorker(missing_agent.id), Actor.core(), environment_id=missing_agent.environment_id)
        WorkerResumeRetry()(container)
