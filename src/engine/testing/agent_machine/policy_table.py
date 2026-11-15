from collections.abc import Sequence

from engine.agent_machine.contracts.policy import Policy
from engine.testing.agent_machine.policy_row import PolicyRow


class PolicyTable:
    """A policy's decision table: every row asked of the policy, and each row whose refusals differ from the
    row's named with both."""

    def __init__(self, rows: Sequence[PolicyRow]) -> None:
        self.rows = rows

    def failures(self, policy: Policy) -> list[str]:
        answers = [(row, tuple(reason.key for reason in policy.refusals(row.question, row.view))) for row in self.rows]
        return [f"{row.name}: refused {keys or 'nothing'}, the table says {row.refusal_keys or 'nothing'}" for row, keys in answers if keys != row.refusal_keys]
