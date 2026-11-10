from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from core.base.provider.providers import Providers
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.support.agent_program_list import AgentProgramList
from core.modules.agents.support.agent_program_choice import AgentProgramChoice


class AgentProgramsSubcommand(ReadSubcommand[AgentProgramList]):
    """`journal agent programs`: the agent programs the journal can start, by name and title."""

    cli_name = "agent"
    name = "programs"

    def __init__(self, providers: Providers) -> None:
        self.providers = providers

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> AgentProgramList:
        return AgentProgramList(tuple(AgentProgramChoice(provider.name, provider.title, tuple(provider.models), provider.model_option) for provider in self.providers.all()))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, AgentProgramList):
            output.write(", ".join(program.name for program in value.programs), value.json())
