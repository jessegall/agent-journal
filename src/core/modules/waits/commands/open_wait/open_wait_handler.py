from engine.enums.actor_type import ActorType
from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.waits.models.wait import Wait
from core.modules.waits.commands.open_wait.open_wait import OpenWait
from core.modules.waits.models.wait_target import WaitTarget
from core.modules.waits.models.enums.wait_type import WaitType
from core.modules.waits.support.wait_targets import WaitTargets


class OpenWaitHandler(Handler[OpenWait, Wait]):
    """Opens the calling agent's wait, with a target row for each table:id it names; a wait on rows names at
    least one, each of them exists, and none of them is already done, which the refusal answers with the
    result."""

    command = OpenWait

    def __init__(self, repository: Repository, targets: WaitTargets) -> None:
        self.repository, self.targets = repository, targets

    def handle(self, command: OpenWait, context: Context) -> Wait:
        if not context.actor.is_agent():
            raise Refusal("only an agent waits", "an agent runs journal wait on or journal wait stuck")
        if command.type is WaitType.ROWS and not command.targets:
            raise Refusal("a wait for rows needs the rows that end it", "add --target tasks:<id>")
        resolved = [self.resolve_target(target) for target in command.targets]
        wait = self.repository.save(Wait(session_agent_id=context.actor.id, creator_id=context.actor.id, type=command.type, focus=command.focus,
                                         opened_at=context.timestamp), context)
        for table, row_id in resolved:
            self.repository.save(WaitTarget(wait_id=wait.id, creator_id=context.actor.id, row_table=table, row_id=row_id), context)
        return wait

    def resolve_target(self, target: str) -> tuple[str, int]:
        word, _, row_id = target.partition(":")
        if not row_id.isdigit():
            raise Refusal(f"{target} is not a row", "write a target as table:id, such as tasks:7")
        model = self.targets.model(word)
        if model is None:
            raise Refusal(f"{word} is not a kind of row a wait can end on", f"write a target as word:id with one of these words: {', '.join(self.targets.registered_names())}")
        row = self.targets.row(model, int(row_id))
        if row is None:
            raise Refusal(f"{target} does not exist, so a wait on it could never end", "name a row that exists")
        ended = self.targets.ended_row(row)
        if ended is not None:
            raise Refusal(self.targets.result(ended, target), "there is nothing to wait for: it is done, so use its result")
        return self.targets.table(model), int(row_id)
