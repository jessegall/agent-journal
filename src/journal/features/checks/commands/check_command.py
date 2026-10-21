from argparse import Namespace

from journal.console.command import Command
from journal.support.caller import Caller
from journal.features.checks.support.check_runner import CheckRunner
from journal.models.check import Check
from journal.repositories.checks import Checks


class CheckCommand(Command):
    noun = "check"

    def __init__(self, checks: Checks, runner: CheckRunner) -> None:
        self.checks, self.runner = checks, runner

    def arguments(self, verbs) -> None:
        create = self.verb(verbs, "create", "a script that passes or fails")
        create.add_argument("title")
        create.add_argument("--command", required=True)
        create.add_argument("--brief", default="", help="what it checks and what a failure means")
        create.add_argument("--every", type=int, default=0, help="minutes; 0 runs it by hand only")
        edit = self.verb(verbs, "edit", "change a check's title, command, brief or interval")
        edit.add_argument("n", type=int)
        edit.add_argument("--title")
        edit.add_argument("--command")
        edit.add_argument("--brief")
        edit.add_argument("--every", type=int, help="minutes; 0 runs it by hand only")
        self.verb(verbs, "run", "run a check now").add_argument("n", type=int)
        self.verb(verbs, "list", "every check and how it last went")

    def create(self, args: Namespace, caller: Caller) -> int:
        check = self.checks.save(Check(title=args.title, brief=args.brief, command=args.command, every=args.every), caller.actor)
        print(f"check {check.id}: {check.title}")
        return 0

    def edit(self, args: Namespace, caller: Caller) -> int:
        check = self.checks.find(args.n)
        edited = check.edited(args.title or check.title, args.brief if args.brief is not None else check.brief, args.command or check.command, args.every if args.every is not None else check.every)
        self.checks.save(edited, caller.actor)
        print(f"check {edited.id}: {edited.title}")
        return 0

    def run(self, args: Namespace, caller: Caller) -> int:
        ran = self.runner.run(self.checks.find(args.n), caller.actor)
        print(f"check {ran.id} {'passed' if ran.last_passed else 'failed'}: {ran.title}")
        if not ran.last_passed:
            print(ran.last_output.strip())
        return 0 if ran.last_passed else 1

    def list(self, args: Namespace, caller: Caller) -> int:
        for check in self.checks.all():
            state = {True: "passed", False: "failed", None: "not run"}[check.last_passed]
            print(f"{check.id:>4}  {state:<8} {check.title}")
        return 0
