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
from suites.coding.support.coding_helper_role import CodingHelperRole


class SwitchWorkerSandboxHandler(Handler[SwitchWorkerSandbox, Agent]):
    """Keeps a worker's sandbox choice on its agent row; only a person or a main agent may switch it."""

    command = SwitchWorkerSandbox

    def __init__(self, agents: AgentRows, repository: Repository) -> None:
        self.agents, self.repository = agents, repository

    def handle(self, command: SwitchWorkerSandbox, context: Context) -> Agent:
        self.agents.require_main(context.actor, "switch a worker's sandbox")
        worker = self.agents.find(command.worker_id)
        if worker.role != CodingHelperRole.WORKER:
            raise Refusal(f"agent {worker.id} is a {worker.role}, not a worker", "journal worker status lists the workers")
        part = {**worker.metadata.module_part(MODULE_KEY), SANDBOX_KEY: command.sandboxed}
        return self.repository.save_metadata(worker, Metadata({**worker.metadata.values, MODULE_KEY: part}), context)
