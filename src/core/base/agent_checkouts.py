from core.base.checkout import Checkout


class AgentCheckouts:
    """The checkout of an agent, answered by the module that knows its rows and by a suite whose agents have their own."""

    def checkout(self, agent_id: int) -> Checkout:
        raise NotImplementedError
