from argparse import ArgumentParser, Namespace
from collections.abc import Sequence
from dataclasses import replace

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.type_guards import is_tuple
from core.modules.profiles.support.agent_profile import AgentProfile
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.usage.models.statistic import Statistic


class ProfileListSubcommand(ReadSubcommand[Sequence[AgentProfile]]):
    """`journal profile list`: each agent profile in the project, with how often it was used and when last."""

    cli_name = "profile"
    name = "list"

    def __init__(self, files: ProfileFiles, queries: Queries) -> None:
        self.files, self.queries = files, queries

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> Sequence[AgentProfile]:
        counts = {row.key: row.value for row in self.queries.query(Statistic).all_rows()}
        return tuple(replace(profile, uses=counts.get(f"profiles.{profile.name}.uses", 0), last_used=counts.get(f"profiles.{profile.name}.last_used", 0)) for profile in self.files.listed())

    def write_output(self, value: object, output: Output) -> None:
        listed = [row for row in value if isinstance(row, AgentProfile)] if is_tuple(value) else []
        output.write("\n".join(f"{row.name}  {row.profile_type}  {row.model or '-'}  used {row.uses}" for row in listed), {"rows": [output.values(row) for row in listed]})
