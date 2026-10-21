import re
from argparse import Namespace

from journal.console.command import Command
from journal.models.command_output import CommandOutput
from journal.features.tasks.support.wait_targets import WaitTargets
from journal.support.rejection import Rejection
from journal.support.caller import Caller
from journal.hooks.command_events import CommandEvents

USER_WAIT_PATTERN = re.compile(r"\b(?:the user|you|sir|user's|your)\b[^.]{0,40}\b(?:answer|answers|reply|replies|response|word|instruction|instructions|message|decision|go-ahead|say|says|to say|to answer|to reply|to decide)"
                                 r"|\b(?:waiting|wait|waits)\s+(?:for|on)\s+(?:the\s+)?(?:user|you|sir|him|them)\b"
                                 r"|\b(?:what|which|whether)\s+(?:the\s+user|you)\b", re.IGNORECASE)
MISSING_WAIT_TARGET = ("a wait names what ends it: --output N, a command's output, ends it once the command is done; --until \"<script>\" is run every 30 seconds and ends it once it passes")
USER_WAIT_REFUSAL = "waiting for the user is no wait: nothing outside ends it. Ask with journal question ask, or end your turn"


class WaitCommand(Command):
    """journal await "<what>": the agent waits for something outside its hands, with or without a task in hand, and names what ends it: a command's output, or a script polled until it passes. It ends by itself once that has, or when the agent works again."""

    noun = "await"
    default_verb = "begin"

    def __init__(self, events: CommandEvents, awaitables: WaitTargets) -> None:
        self.events, self.awaitables = events, awaitables

    def arguments(self, verbs) -> None:
        time = self.verb(verbs, "begin", "say what you wait for, and name what ends the wait")
        time.add_argument("what", help="what you wait for, as its title: the test run, the build, Lady Lovelace's report")
        time.add_argument("--output", type=int, action="append", default=[], metavar="N", help="a command's output; the wait ends once the command is done; more than one waits for all")
        time.add_argument("--until", default="", metavar="SCRIPT", help="a shell script run every 30 seconds; the wait ends once it passes, such as ! kill -0 <pid> for a process")

    def begin(self, args: Namespace, caller: Caller) -> int:
        if not args.output and not args.until:
            raise Rejection(MISSING_WAIT_TARGET)
        if USER_WAIT_PATTERN.search(args.what):
            raise Rejection(USER_WAIT_REFUSAL)
        names = [self.awaitables.ref(output) for output in self.running(args.output)] + ([self.awaitables.polled_check(args.until, args.what, caller.actor)] if args.until else [])
        self.events.wait_declared(args.what, ",".join(names), caller)
        print(f"waiting for {args.what}, on {', '.join(self.awaitables.title(name) for name in names)}; it ends by itself once all of it has settled, or when you work again")
        return 0

    def running(self, numbers: list[int]) -> list[CommandOutput]:
        outputs = [self.awaitables.outputs.find(n) for n in numbers]
        active_outputs = [output for output in outputs if not output.ended]
        if outputs and not active_outputs:
            endings = ", ".join(f"output {output.id} already {output.ending()}" for output in outputs)
            raise Rejection(f"{endings}: read it with journal output read <n> --summary")
        return active_outputs
