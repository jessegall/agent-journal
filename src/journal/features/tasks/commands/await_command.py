import re
from argparse import Namespace

from journal.console.command import Command
from journal.support.awaitables import Awaitables
from journal.support.refused import Refused
from journal.support.caller import Caller
from journal.hooks.command_events import CommandEvents

WAITING_ON_THE_USER = re.compile(r"\b(?:the user|you|sir|user's|your)\b[^.]{0,40}\b(?:answer|answers|reply|replies|response|word|instruction|instructions|message|decision|go-ahead|say|says|to say|to answer|to reply|to decide)"
                                 r"|\b(?:waiting|wait|waits)\s+(?:for|on)\s+(?:the\s+)?(?:user|you|sir|him|them)\b"
                                 r"|\b(?:what|which|whether)\s+(?:the\s+user|you)\b", re.IGNORECASE)
UNNAMED = ("a wait names what ends it: --output N, a command's output, ends it once the command is done; --until \"<script>\" is run every 30 seconds and ends it once it passes")
FOR_THE_USER = "waiting for the user is no wait: nothing outside ends it. Ask with journal question ask, or end your turn"


class AwaitCommand(Command):
    """journal await "<what>": the agent waits for something outside its hands, with or without a task in hand, and names what ends it: a command's output, or a script polled until it passes. It ends by itself once that has, or when the agent works again."""

    noun = "await"
    default_verb = "now"

    def __init__(self, events: CommandEvents, awaitables: Awaitables) -> None:
        self.events, self.awaitables = events, awaitables

    def arguments(self, verbs) -> None:
        now = self.verb(verbs, "now", "say what you wait for, and name what ends the wait")
        now.add_argument("what", help="what you wait for, as its title: the test run, the build, Lady Lovelace's report")
        now.add_argument("--output", type=int, action="append", default=[], metavar="N", help="a command's output; the wait ends once the command is done; more than one waits for all")
        now.add_argument("--until", default="", metavar="SCRIPT", help="a shell script run every 30 seconds; the wait ends once it passes, such as ! kill -0 <pid> for a process")

    def now(self, args: Namespace, caller: Caller) -> int:
        if not args.output and not args.until:
            raise Refused(UNNAMED)
        if WAITING_ON_THE_USER.search(args.what):
            raise Refused(FOR_THE_USER)
        names = [self.awaitables.output(n) for n in args.output] + ([self.awaitables.until(args.until, args.what, caller.actor)] if args.until else [])
        self.events.wait_declared(args.what, ",".join(names), caller)
        print(f"waiting for {args.what}, on {', '.join(self.awaitables.title_of(name) for name in names)}; it ends by itself once all of it has settled, or when you work again")
        return 0
