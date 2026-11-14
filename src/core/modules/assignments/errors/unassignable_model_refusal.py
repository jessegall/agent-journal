from collections.abc import Sequence

from engine.errors.refusal import Refusal


class UnassignableModelRefusal(Refusal):
    """A row of a model that cannot be assigned was named in an assign or unassign command."""

    def __init__(self, cli_name: str, assignable_names: Sequence[str]) -> None:
        super().__init__(f"a {cli_name} cannot be assigned", f"these can: {', '.join(assignable_names)}" if assignable_names else "no model of this journal can")
