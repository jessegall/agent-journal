import shlex

from engine.agent.agent_checkouts import AgentCheckouts
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.driver.command_category import CommandCategory
from core.base.query.queries import Queries
from engine.errors.refusal import Refusal
from core.modules.helpers.commands.run_granted_command.run_granted_command import RunGrantedCommand
from core.modules.helpers.models.helper_grant import HelperGrant
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.models.process import Process

GRANTED_RUN_LIMIT_SECONDS = 3600


class RunGrantedCommandHandler(Handler[RunGrantedCommand, Process]):
    """Starts a line in the helper's own folder when one of its grants allows every word of it."""

    command = RunGrantedCommand

    def __init__(self, queries: Queries, checkouts: AgentCheckouts, bus: Bus) -> None:
        self.queries, self.checkouts, self.bus = queries, checkouts, bus

    def handle(self, command: RunGrantedCommand, context: Context) -> Process:
        line = shlex.join(command.command_parts)
        grant = self.queries.query(HelperGrant).filter(helper_id=context.actor.id, program=command.command_parts[0]).first()
        if grant is None or not grant.allows(command.command_parts):
            raise Refusal(f"{line} is not granted to you", "ask the main agent for a grant")
        folder = str(self.checkouts.checkout(context.actor.id).root)
        return self.bus.dispatch(StartProcess.single_part(context.actor.id, line, folder, CommandCategory.UNKNOWN, GRANTED_RUN_LIMIT_SECONDS), context)
