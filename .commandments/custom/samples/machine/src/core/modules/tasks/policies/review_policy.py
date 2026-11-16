from engine.agent_machine.contracts.policy import Policy
from engine.query.queries import Queries


class ReviewPolicy(Policy):
    key = "tasks.review"

    # @righteous architecture_drivers_contribution_takes_a_bus
    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def refusals(self, question, view):
        return []
