from engine.errors.refusal import Refusal


class EndedAgentRefusal(Refusal):
    """A row was to be given to an agent whose session has ended."""

    def __init__(self, agent_number: int) -> None:
        super().__init__(f"agent {agent_number} has ended", "assign to an agent that runs, or to a user")
