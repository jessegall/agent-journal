from argparse import Namespace
from pathlib import Path

from journal.console.command import Command
from journal.support.where import Where
from journal.features.shell.support.output_files import OutputFiles
from journal.features.shell.support.reader import Reader
from journal.features.shell.support.readers import Readers
from journal.models.command_output import CommandOutput
from journal.support.refused import Refused
from journal.repositories.command_outputs import CommandOutputs

ENDS = 10


class OutputCommand(Command):
    """The outputs the runner kept, by number: read one whole or in part, or list the newest."""

    noun = "output"

    def __init__(self, outputs: CommandOutputs, readers: Readers) -> None:
        self.outputs, self.readers = outputs, readers

    def arguments(self, verbs) -> None:
        read = self.verb(verbs, "read", "the part of an output a flag names; one flag is needed, so reading it whole is a choice: --summary for how it ended with its ends, --all for every line")
        read.add_argument("n", type=int)
        read.add_argument("--summary", action="store_true", help="its command, how it ended, its length and its first and last lines")
        read.add_argument("--all", action="store_true", help="every line, for an output you truly need whole")
        read.add_argument("--head", type=int, help="the first so many lines")
        read.add_argument("--tail", type=int, help="the last so many lines")
        read.add_argument("--lines", help="a range of lines, such as 100-160")
        read.add_argument("--grep", help="the lines matching a pattern, with their numbers")
        read.add_argument("--reader", help="the lines a reader of the project's picks, by its name")
        listed = self.verb(verbs, "list", "the newest outputs, one a line: number, how it ended, command")
        listed.add_argument("--last", type=int, default=20)

    def read(self, args: Namespace, where: Where) -> int:
        output = self.outputs.find(args.n)
        files = OutputFiles(Path(output.folder))
        if not files.is_kept():
            raise Refused(f"output {output.id} has no files left")
        if args.tail:
            print("\n".join(files.last(args.tail)))
            return 0
        lines = files.lines()
        if args.reader:
            print("\n".join(self.readers.named(args.reader).read(lines)))
            return 0
        if args.grep:
            print("\n".join(Reader("grep", "the lines matching a pattern", args.grep).read(lines)))
            return 0
        if args.lines:
            first, _, last = args.lines.partition("-")
            print("\n".join(lines[int(first) - 1:int(last or first)]))
            return 0
        if args.head:
            print("\n".join(lines[:args.head]))
            return 0
        if args.all:
            print("\n".join(lines))
            return 0
        if args.summary:
            print(self.summary(output, files, lines))
            return 0
        raise Refused(f"name the part of output {output.id} to read: --tail 20, --head 20, --grep \"<words>\", --lines 40-80, --reader <name>, --summary for how it ended, or --all for every line")

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
