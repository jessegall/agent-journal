from argparse import Namespace
from pathlib import Path

from journal.features.shell.support.activity_title import ActivityTitle
from journal.console.command import HELPER_KINDS, WORKER_KINDS, Command
from journal.support.caller import Caller
from journal.features.shell.support.output_files import OutputFiles
from journal.features.shell.support.output_views import OutputViews
from journal.features.shell.support.reader import Reader
from journal.features.shell.support.readers import Readers
from journal.models.command_output import CommandOutput
from journal.support.rejection import Rejection
from journal.repositories.command_outputs import CommandOutputs

END_LINES = 10


class OutputCommand(Command):
    """The outputs the runner kept, by number: read one whole or in part, say how one stands, list the newest, or watch a running one."""

    noun = "output"
    callers = {"read": HELPER_KINDS, "list": WORKER_KINDS, "status": WORKER_KINDS, "watch": WORKER_KINDS}

    def __init__(self, outputs: CommandOutputs, readers: Readers, views: OutputViews) -> None:
        self.outputs, self.readers, self.views = outputs, readers, views

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
        status = self.verb(verbs, "status", "one line: running, finished, or failed with code C; with no number, the status of each background output of yours")
        status.add_argument("n", type=int, nargs="?")
        listed = self.verb(verbs, "list", "the newest outputs, one a line: number, how it ended, command")
        listed.add_argument("--last", type=int, default=20)
        watch = self.verb(verbs, "watch", "bind a running output to you: after every tool use you see its reader's lines, or its last lines, and a card in the chat shows them, until its command ends")
        watch.add_argument("n", type=int)
        watch.add_argument("--reader", default="", help="the reader whose lines are shown, by its name")
        watch.add_argument("--title", default="", help="what the card in the chat says the run is doing, such as Running tests; never a bare name such as Tests")
        self.verb(verbs, "unwatch", "end the watch on your output")

    def owned(self, n: int, caller: Caller) -> CommandOutput:
        output = self.outputs.find(n)
        if caller.worker_number is not None and output.creator != caller.actor:
            raise Rejection(f"output {n} is not worker {caller.worker_number}'s: a worker reads only the outputs of its own commands")
        return output

    def read(self, args: Namespace, caller: Caller) -> int:
        output = self.owned(args.n, caller)
        files = OutputFiles(Path(output.folder))
        if not files.is_stored():
            raise Rejection(f"output {output.id} has no files left")
        if args.tail:
            print("\n".join(files.last(args.tail)))
            return 0
        lines = files.lines()
        if args.reader:
            print("\n".join(self.readers.lookup(args.reader).read(lines)))
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
        raise Rejection(f"name the part of output {output.id} to read: --tail 20, --head 20, --grep \"<words>\", --lines 40-80, --reader <name>, --summary for how it ended, or --all for every line")

    def status(self, args: Namespace, caller: Caller) -> int:
        if args.n is not None:
            print(self.state(self.owned(args.n, caller)))
            return 0
        for output in self.outputs.backgrounded(caller.session):
            print(f"{output.id:>5}  {self.state(output):<22}  {output.headline()[:100]}")
        return 0

    @staticmethod
    def state(output: CommandOutput) -> str:
        if output.ended:
            return output.ending()
        outcome = OutputFiles(Path(output.folder)).outcome()
        return "running" if outcome == "still running" else outcome

    def summary(self, output: CommandOutput, files: OutputFiles, lines: list[str]) -> str:
        head = [f"output {output.id}: {files.outcome()}, {len(lines):,} lines", f"command: {output.headline()}"]
        if len(lines) <= END_LINES * 2:
            return "\n".join([*head, *lines])
        cut = f"... {len(lines) - END_LINES * 2:,} lines; read them with --lines, --grep, --head or --tail ..."
        return "\n".join([*head, *lines[:END_LINES], cut, *lines[-END_LINES:]])

    def list(self, args: Namespace, caller: Caller) -> int:
        for output in self.page(args.last, caller):
            files = OutputFiles(Path(output.folder))
            outcome = files.outcome() if files.is_stored() else "files gone"
            print(f"{output.id:>5}  {outcome:<22}  {output.headline()[:100]}")
        return 0

    def page(self, last: int, caller: Caller) -> list[CommandOutput]:
        if caller.worker_number is None:
            return self.outputs.page(last)
        return self.outputs.page(last, creator=caller.actor)

    def watch(self, args: Namespace, caller: Caller) -> int:
        output = self.owned(args.n, caller)
        if output.ended:
            raise Rejection(f"output {output.id} {output.ending()}; read it with journal output read {output.id} --summary")
        if args.reader:
            self.readers.lookup(args.reader)
        self.views.card(self.outputs.watch(output, args.reader, ActivityTitle.checked(args.title), caller.actor))
        print(f"watching output {output.id}: you see its view after every tool use until its command ends")
        return 0

    def unwatch(self, args: Namespace, caller: Caller) -> int:
        for output in self.outputs.watched(caller.session):
            self.outputs.save(output.unwatched(), caller.actor)
            print(f"output {output.id} is no longer watched")
        return 0
