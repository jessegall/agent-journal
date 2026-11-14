from engine.errors.refusal import Refusal


class MissingBlockTargetRefusal(Refusal):
    """A block was to wait on a row that does not exist, so it could never close."""

    def __init__(self, condition_name: str, target: str) -> None:
        super().__init__(f"a block on {condition_name} {target} could never close: {target} does not exist", "name a row that exists")
