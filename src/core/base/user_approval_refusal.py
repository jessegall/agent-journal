from core.base.block_refusal import BlockRefusal
from core.base.command.command import Command


class UserApprovalRefusal(BlockRefusal):
    """An action that waits for a person to accept or refuse it in the dock. It names the command that Accept runs as
    the person, and that command alone: the line the agent ran, with any flags of its own, is not run. why is the reason the requester gives,
    shown under the question; a request with none is refused."""

    def __init__(self, question: str, arguments: tuple[str, ...] = (), refused_arguments: tuple[str, ...] = (),
                 required_person_id: int | None = None, continued_arguments: tuple[str, ...] = (), source_version: int | None = None,
                 returns_output: bool = False, command: Command[object] | None = None, why: str = "") -> None:
        super().__init__(question, "A person was asked in the dock.")
        self.arguments, self.refused_arguments = arguments, refused_arguments
        self.required_person_id = required_person_id
        self.continued_arguments = continued_arguments
        self.source_version = source_version
        self.returns_output = returns_output
        self.command = command
        self.why = why
