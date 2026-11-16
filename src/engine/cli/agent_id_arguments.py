from argparse import Namespace

from engine.cli.agent_id import AgentId
from engine.cli.agent_ids import AgentIds


class AgentIdArguments:
    """Checks every agent id among the parsed arguments of a line against the environment the line runs in.
    It runs after the environment of the line is checked."""

    def __init__(self, agent_ids: AgentIds) -> None:
        self.agent_ids = agent_ids

    def check(self, arguments: Namespace, environment_id: int | None) -> None:
        for value in vars(arguments).values():
            for item in value if isinstance(value, list) else [value]:
                if isinstance(item, AgentId):
                    self.agent_ids.checked(int(item), environment_id)
