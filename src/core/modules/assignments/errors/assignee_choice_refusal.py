from engine.errors.refusal import Refusal


class AssigneeChoiceRefusal(Refusal):
    """An assign command named neither an actor nor the parent to inherit from, or named both."""

    def __init__(self) -> None:
        super().__init__("an assign names one of --to <actor> and --from-parent", "give exactly one of them")
