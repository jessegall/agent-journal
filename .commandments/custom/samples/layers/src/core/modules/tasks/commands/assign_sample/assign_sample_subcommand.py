from argparse import ArgumentParser

from engine.cli.agent_id import AgentId


class AssignSampleSubcommand:
    def arguments(self, parser: ArgumentParser) -> None:
        # @sin architecture_agents_agent_argument_as_int
        parser.add_argument("--agent", type=int)
        # @righteous architecture_agents_agent_argument_as_int
        parser.add_argument("--to-agent", type=AgentId)

