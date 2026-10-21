from argparse import Namespace
from datetime import datetime

from journal.console.command import Command
from journal.features.faults.support.developer_numbers import DeveloperNumbers
from journal.http.journal.answer_time import AnswerTime
from journal.models.timing import Timing
from journal.support.caller import Caller

TOP = 10


class DeveloperCommand(Command):
    """journal developer: how fast the journal answers and what each request reads, from the same numbers the Developer tab shows."""

    noun = "developer"

    def __init__(self, numbers: DeveloperNumbers) -> None:
        self.numbers = numbers

    def arguments(self, verbs) -> None:
        slowest = self.verb(verbs, "slowest", "the slowest requests and hooks of the rolling log, with their path, kind and milliseconds")
        kinds = slowest.add_mutually_exclusive_group()
        kinds.add_argument("--hooks", action="store_true", help="hooks only")
        kinds.add_argument("--requests", action="store_true", help="requests only")
        slowest.add_argument("--top", type=int, default=TOP, help="how many, the slowest first")
        self.verb(verbs, "loads", "the newest requests with the records each read, by kind, while load counting is on")
        self.verb(verbs, "models", "the records read per kind since the last reset")
        self.verb(verbs, "averages", "the average and slowest time of hooks, requests and each kind of hook")
        self.verb(verbs, "reset", "clear the times, the rolling log and the counts")

    def slowest(self, args: Namespace, caller: Caller) -> int:
        self.print_lines([f"{t.ms:>6} ms  {t.method:<5} {t.route}" for t in self.slowest_kind(args)], "nothing logged yet")
        return 0

    def slowest_kind(self, args: Namespace) -> list[Timing]:
        if args.hooks:
            return self.numbers.slowest_hooks(args.top)
        if args.requests:
            return self.numbers.slowest_requests(args.top)
        return self.numbers.slowest(args.top)

    def loads(self, args: Namespace, caller: Caller) -> int:
        self.print_lines([f"{self.clock(t)}  {t.load_line()}" for t in self.numbers.loaded()], "nothing counted: turn on faults.count_loads in the Developer tab")
        return 0

    def models(self, args: Namespace, caller: Caller) -> int:
        self.print_lines([f"{total.rows:>8}  {total.model}" for total in self.numbers.model_totals()], "nothing counted yet")
        return 0

    def averages(self, args: Namespace, caller: Caller) -> int:
        rows = {"hooks": self.numbers.hook_time(), "requests": self.numbers.request_time(), **{f"hook {kind}": time for kind, time in self.numbers.hook_averages().items()}}
        self.print_lines([self.average_line(name, time) for name, time in rows.items() if time.count], "nothing measured yet")
        return 0

    def reset(self, args: Namespace, caller: Caller) -> int:
        self.numbers.reset(caller.actor)
        print("the times, the rolling log and the counts are cleared")
        return 0

    @staticmethod
    def average_line(name: str, time: AnswerTime) -> str:
        return f"{name:<28} {time.count:>6} measured  {time.average_ms():>5} ms average  {time.slowest_ms:>5} ms slowest"

    @staticmethod
    def clock(timing: Timing) -> str:
        return datetime.fromtimestamp(timing.time).strftime("%H:%M:%S")

    @staticmethod
    def print_lines(lines: list[str], empty: str) -> None:
        print("\n".join(lines) if lines else empty)
