from argparse import ArgumentParser, Namespace
from pathlib import Path

from core.base.caller.caller import Caller
from core.base.provider.hook_trust import HookTrust
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.codex.providers.codex_provider import CodexProvider


class HookTrustSubcommand(ReadSubcommand[HookTrust]):
    """`journal codex hook-trust <folder>`: whether Codex runs the journal's hooks in the folder, for the launcher."""

    cli_name = "codex"
    name = "hook-trust"

    def __init__(self, provider: CodexProvider) -> None:
        self.provider = provider

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("folder")

    def read(self, arguments: Namespace, caller: Caller) -> HookTrust:
        return self.provider.hook_trust(Path(arguments.folder))

    def write_output(self, value: object, output: Output) -> None:
        output.line(str(value))
