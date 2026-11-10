from core.modules.mcp.support.server_configs import ServerConfigs
from argparse import ArgumentParser, Namespace
from collections.abc import Sequence

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from engine.types.type_guards import is_tuple
from core.modules.mcp.queries.mcp_server_query import McpServerQuery
from core.modules.mcp.support.server_standing import NEEDS_KEY, ServerStanding


class McpCheckSubcommand(ReadSubcommand[Sequence[str]]):
    """`journal mcp check`: what each installed server still needs, its key or its place in a config, and
    where it is written; the journal checks what it keeps and never starts an agent program for it."""

    cli_name = "mcp"
    name = "check"

    def __init__(self, servers: McpServerQuery, standing: ServerStanding, configs: ServerConfigs) -> None:
        self.servers, self.standing, self.configs = servers, standing, configs

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> Sequence[str]:
        config_names = self.configs.names()
        lines: list[str] = []
        for server in self.servers.oldest().all_rows():
            missing = [file for file, names in config_names.items() if server.name not in names]
            if self.standing.standing(server) == NEEDS_KEY:
                lines.append(f"{server.name}  needs its key: journal mcp key {server.name} <value>")
            elif missing:
                lines.append(f"{server.name}  missing from {' and '.join(missing)}: journal mcp remove {server.name}, then journal mcp install {server.name}")
            else:
                lines.append(f"{server.name}  written in {' and '.join(config_names)}")
        return tuple(lines)

    def write_output(self, value: object, output: Output) -> None:
        lines = [line for line in value if isinstance(line, str)] if is_tuple(value) else []
        output.write("\n".join(lines) or "no servers installed", {"lines": lines})
