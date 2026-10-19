import re
from argparse import Namespace
from pathlib import Path

from journal.console.command import Command
from journal.console.where import Where
from journal.features.shell.output_files import OutputFiles
from journal.models.command_output import CommandOutput
from journal.refused import Refused
from journal.repositories.command_outputs import CommandOutputs

ENDS = 10
"""The lines shown at each end of an output read whole."""


class OutputCommand(Command):
    """The outputs the runner kept, by number: read one whole or in part, or list the newest."""

    noun = "output"

    def __init__(self, outputs: CommandOutputs) -> None:
        self.outputs = outputs

    def arguments(self, verbs) -> None:
        read = self.verb(verbs, "read", "an output: its command, how it ended, its length and its first and last lines, or the part the options name")
        read.add_argument("n", type=int)
        read.add_argument("--head", type=int, help="the first so many lines")
        read.add_argument("--tail", type=int, help="the last so many lines")
        read.add_argument("--lines", help="a range of lines, such as 100-160")
        read.add_argument("--grep", help="the lines matching a pattern, with their numbers")
        listed = self.verb(verbs, "list", "the newest outputs, one a line: number, how it ended, command")
        listed.add_argument("--last", type=int, default=20)

    def read(self, args: Namespace, where: Where) -> int:
        output = self.outputs.find(args.n)
        files = OutputFiles(Path(output.folder))
        if not files.is_kept():
            raise Refused(f"output {output.id} has no files left")
        lines = files.lines()
        if args.grep:
            pattern = re.compile(args.grep)
            print("\n".join(f"{i}: {line}" for i, line in enumerate(lines, 1) if pattern.search(line)))
            return 0
        if args.lines:
            first, _, last = args.lines.partition("-")
            print("\n".join(lines[int(first) - 1:int(last or first)]))
            return 0
        if args.head or args.tail:
            print("\n".join(lines[:args.head] if args.head else lines[-args.tail:]))
            return 0
        print(self.summary(output, files, lines))
        return 0

    def summary(self, output: CommandOutput, files: OutputFiles, lines: list[str]) -> str:
        head = [f"output {output.id}: {files.outcome()}, {len(lines):,} lines", f"command: {output.headline()}"]
        if len(lines) <= ENDS * 2:
            return "\n".join([*head, *lines])
        cut = f"... {len(lines) - ENDS * 2:,} lines; read them with --lines, --grep, --head or --tail ..."
        return "\n".join([*head, *lines[:ENDS], cut, *lines[-ENDS:]])

    def list(self, args: Namespace, where: Where) -> int:
        for output in self.outputs.page(args.last):
            files = OutputFiles(Path(output.folder))
            outcome = files.outcome() if files.is_kept() else "files gone"
            print(f"{output.id:>5}  {outcome:<22}  {output.headline()[:100]}")
        return 0
