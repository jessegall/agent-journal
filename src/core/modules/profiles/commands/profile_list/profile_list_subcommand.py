from argparse import ArgumentParser, Namespace
from collections.abc import Sequence
from dataclasses import replace

from core.base.agent_type_book import AgentTypeBook
from core.base.caller.caller import Caller
from core.base.profile.agent_profile import AgentProfile
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.type_guards import is_tuple
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.profiles.support.profile_problem import ProfileProblem
from core.modules.usage.models.statistic import Statistic


class ProfileListSubcommand(ReadSubcommand[Sequence[AgentProfile | ProfileProblem]]):
    """Lists effective profiles, their origins, personal changes and any file problems."""

    cli_name = "profile"
    name = "list"

    def __init__(self, files: ProfileFiles, queries: Queries, types: AgentTypeBook) -> None:
        self.files, self.queries, self.types = files, queries, types

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> Sequence[AgentProfile | ProfileProblem]:
        counts = {row.key: row.value for row in self.queries.query(Statistic).all_rows()}
        return tuple(replace(profile, uses=counts.get(f"profiles.{profile.name}.uses", 0), last_used=counts.get(f"profiles.{profile.name}.last_used", 0)) if isinstance(profile, AgentProfile) else profile for profile in self.files.listed())

    def write_output(self, value: object, output: Output) -> None:
        listed = [row for row in value if isinstance(row, (AgentProfile, ProfileProblem))] if is_tuple(value) else []
        lines = [f"{row.name}  {row.agent_type}  {row.model or '-'}  used {row.uses}" if isinstance(row, AgentProfile) and not row.problem else f"{row.name}  {row.problem}" for row in listed]
        output.write("\n".join(lines), {"rows": [{**output.values(row), "shipped": isinstance(row, AgentProfile) and row.is_builtin} for row in listed],
                                       "types": [{"key": entry.key, "label": entry.label, "access": entry.access.value, "extends": entry.extends} for entry in self.types.startable()]})
