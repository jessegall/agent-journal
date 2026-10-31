from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.waits.models.wait import Wait
from core.modules.waits.commands.open_wait import OpenWait
from core.modules.waits.models.wait_target import WaitTarget
from core.modules.waits.models.enums.wait_type import WaitType


class OpenWaitHandler(Handler[OpenWait, Wait]):
    """Opens the calling agent's wait, with a target row for each table:id it names; a wait on rows names at
    least one."""

    command = OpenWait

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: OpenWait, context: Context) -> Wait:
        if context.actor.type is not ActorType.AGENT:
            raise Refusal("only an agent waits", "an agent runs journal wait on or journal wait stuck")
        if command.type is WaitType.ROWS and not command.targets:
            raise Refusal("a wait for rows needs the rows that end it", "add --target tasks:<id>")
        wait = self.repository.save(Wait(agent_id=context.actor.id, creator_id=context.actor.id, type=command.type, focus=command.focus,
                                         opened_at=context.timestamp), context)
        for target in command.targets:
            table, _, row_id = target.partition(":")
            if not row_id.isdigit():
                raise Refusal(f"{target} is not a row", "write a target as table:id, such as tasks:7")
            self.repository.save(WaitTarget(wait_id=wait.id, creator_id=context.actor.id, row_table=table, row_id=int(row_id)), context)
        return wait
