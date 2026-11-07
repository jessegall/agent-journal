from core.base.block import Block


class UserApproval(Block):
    """An action that waits for a person to accept or refuse it in the dock."""

    def __init__(self, question: str, arguments: tuple[str, ...] = (), refused_arguments: tuple[str, ...] = (),
                 required_person_id: int | None = None, continued_arguments: tuple[str, ...] = ()) -> None:
        super().__init__(question, "A person was asked in the dock.")
        self.arguments, self.refused_arguments = arguments, refused_arguments
        self.required_person_id = required_person_id
        self.continued_arguments = continued_arguments
