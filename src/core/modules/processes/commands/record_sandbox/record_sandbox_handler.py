from engine.enums.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from engine.enums.sandbox_level import SandboxLevel
from core.modules.processes.commands.record_sandbox.record_sandbox import RecordSandbox
from core.modules.processes.models.process import Process


class RecordSandboxHandler(Handler[RecordSandbox, Process]):
    command = RecordSandbox

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RecordSandbox, context: Context) -> Process:
        process = self.queries.query(Process).find(command.process_id)
        if context.actor.type is ActorType.AGENT and context.actor.id != process.session_agent_id:
            raise Refusal("only the agent that ran a line records its sandbox", "report on your own process")
        if command.level is SandboxLevel.NONE:
            raise Refusal("a sandbox report must specify the protection used", "run the sandbox self-test")
        return self.repository.save(process.changed(sandbox_level=command.level), context)
