from dataclasses import dataclass

from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class Environment(Model):
    """A place the work happens: a checkout folder and its branch, named uniquely. A test environment holds
    fake agents for trying the journal out, and the one agent a person granted it may work there from its
    own environment."""

    model_name = "environment"
    cli_name = "environment"
    shared_rows = True

    name: str
    folder: str
    branch: str = ""
    creator_id: int
    test: bool = False
    test_agent_id: int | None = None

    def grants(self, agent_id: int) -> bool:
        return self.test and self.test_agent_id == agent_id
