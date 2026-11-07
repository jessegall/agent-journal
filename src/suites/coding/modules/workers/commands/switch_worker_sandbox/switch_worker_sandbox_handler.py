from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.metadata import Metadata
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from suites.coding.modules.workers.commands.switch_worker_sandbox.switch_worker_sandbox import SwitchWorkerSandbox
from suites.coding.modules.workers.support.worker_sandbox_choice import SANDBOX_KEY
from suites.coding.modules.workers.support.worker_settings import MODULE_KEY
from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole


class SwitchWorkerSandboxHandler(Handler[SwitchWorkerSandbox, Agent]):
    """Keeps a worker's sandbox choice on its agent row; only a person or a main agent may switch it."""

    command = SwitchWorkerSandbox

    def __init__(self, agents: AgentRows, repository: Repository) -> None:
        self.agents, self.repository = agents, repository

    def handle(self, command: SwitchWorkerSandbox, context: Context) -> Agent:
        self.check_caller(context)
        worker = self.agents.find(command.worker_id)
        if worker.role != AgentRole.WORKER:
            raise Refusal(f"agent {worker.id} is a {worker.role}, not a worker", "journal worker status lists the workers")
        part = {**worker.metadata.module_part(MODULE_KEY), SANDBOX_KEY: command.sandboxed}
        return self.repository.save_metadata(worker, Metadata({**worker.metadata.values, MODULE_KEY: part}), context)

    def check_caller(self, context: Context) -> None:
        if context.actor.type is not ActorType.AGENT:
            return
        caller = self.agents.find(context.actor.id)
        if caller.role != AgentRole.MAIN:
            raise Refusal(f"a {caller.role} cannot switch a worker's sandbox", "ask the main agent or a person")
