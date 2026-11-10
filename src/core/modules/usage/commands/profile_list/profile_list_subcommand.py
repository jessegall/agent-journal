from argparse import ArgumentParser, Namespace
from collections.abc import Sequence
from dataclasses import replace

from engine.helper_type.helper_type_book import HelperTypeBook
from engine.caller.caller import Caller
from engine.profile.agent_profile import AgentProfile
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.types.type_guards import is_tuple
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.profiles.support.profile_problem import ProfileProblem
from core.modules.usage.models.statistic import Statistic

PROFILE_COUNTERS = ("uses", "last_used")
PROFILE_COUNTERS_REASON = "Two counters for each profile, and the profiles are files a person keeps by hand."


class ProfileListSubcommand(ReadSubcommand[Sequence[AgentProfile | ProfileProblem]]):
    """Lists effective profiles, their origins, personal changes and any file problems."""

    cli_name = "profile"
    name = "list"

    def __init__(self, files: ProfileFiles, queries: Queries, types: HelperTypeBook) -> None:
        self.files, self.queries, self.types = files, queries, types

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> Sequence[AgentProfile | ProfileProblem]:
        listed = self.files.listed()
        keys = [f"profiles.{profile.name}.{counter}" for profile in listed for counter in PROFILE_COUNTERS]
        counts = {row.key: row.value for row in self.queries.query(Statistic).matching(Among("key", keys)).full_table(PROFILE_COUNTERS_REASON).all_rows()}
        return tuple(replace(profile, uses=counts.get(f"profiles.{profile.name}.uses", 0), last_used=counts.get(f"profiles.{profile.name}.last_used", 0)) if isinstance(profile, AgentProfile) else profile for profile in listed)

    def write_output(self, value: object, output: Output) -> None:
        listed = [row for row in value if isinstance(row, (AgentProfile, ProfileProblem))] if is_tuple(value) else []
        lines = [f"{row.name}  {row.agent_type}  {row.model or '-'}  used {row.uses}  {row.occupant.value}" if isinstance(row, AgentProfile) and not row.problem else f"{row.name}  {row.problem}" for row in listed]
        output.write("\n".join(lines), {"rows": [{**output.values(row), "shipped": isinstance(row, AgentProfile) and row.is_builtin} for row in listed],
                                       "types": [{"key": entry.key, "label": entry.label, "access": entry.access.value, "extends": entry.extends} for entry in self.types.startable()]})
