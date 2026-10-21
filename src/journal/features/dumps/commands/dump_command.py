from argparse import Namespace

from journal.console.command import Command
from journal.support.caller import Caller
from journal.features.dumps.support.filing import Filing
from journal.repositories.dumps import Dumps


class DumpCommand(Command):
    noun = "dump"

    def __init__(self, filing: Filing, dumps: Dumps) -> None:
        self.filing, self.dumps = filing, dumps

    def arguments(self, verbs) -> None:
        self.verb(verbs, "create", "drop pasted text as a dump to be sorted and filed").add_argument("brief")
        self.verb(verbs, "list", "every dump here, newest last")
        self.verb(verbs, "items", "where every item of a dump stands").add_argument("n", type=int)
        note = self.verb(verbs, "note", "what an item is, once read")
        self.numbered(note, "item", "insight")
        filed = self.verb(verbs, "filed", "what was done with an item: the rows it became")
        self.numbered(filed, "item", "how")
        filed.add_argument("--refs", default="", help="the rows filed, as doc:2, comma separated")
        filed.add_argument("--added", default="", help="the rows written unasked, also listed in refs")
        failed = self.verb(verbs, "failed", "why an item could not be filed")
        self.numbered(failed, "item", "why")
        name = self.verb(verbs, "name", "name the dump for what its items are about")
        self.numbered(name, "title")
        log = self.verb(verbs, "log", "tell the user what you are doing")
        self.numbered(log, "status")
        log.add_argument("--on", default="", help="the row being worked on, as doc:2")
        log.add_argument("--making", default="", help="what is being made")
        log.add_argument("--detail", default="", help="the sentence behind the status")
        self.numbered(self.verb(verbs, "say", "answer what the user wrote in the dump, at most 600 characters"), "text")
        ask = self.verb(verbs, "ask", "ask the user in the dump window")
        self.numbered(ask, "question")
        ask.add_argument("--guesses", default="", help="up to four likely answers, apart by |")
        offer = self.verb(verbs, "offer", "sum up what was filed and offer next steps as buttons")
        self.numbered(offer, "options")
        offer.add_argument("--summary", default="", help="what was filed and where")
        self.numbered(self.verb(verbs, "split", "split the pasted text into named parts, one item each"), "parts")
        self.numbered(self.verb(verbs, "answer", "the user's answer to a question"), "text")
        choose = self.verb(verbs, "choose", "the user picks an offered step")
        choose.add_argument("n", type=int)
        choose.add_argument("pick", type=int, help="the number of an offered step, or -1 for You decide")
        for verb, help in (("stop", "the user stops a dump"), ("remove", "the user removes a dump and what it made"), ("reopen", "work a closed dump again"), ("dismiss", "put a closed dump away")):
            self.verb(verbs, verb, help).add_argument("n", type=int)

    @staticmethod
    def numbered(parser, *words: str) -> None:
        parser.add_argument("n", type=int)
        for word in words:
            parser.add_argument(word)

    def create(self, args: Namespace, caller: Caller) -> int:
        dump = self.filing.create(args.brief, caller.actor)
        print(f"dump {dump.id}: {dump.title}")
        return 0

    def list(self, args: Namespace, caller: Caller) -> int:
        for dump in self.dumps.in_():
            print(f"{dump.id:>4}  {dump.title}  {dump.outcome or 'open'}")
        return 0

    def items(self, args: Namespace, caller: Caller) -> int:
        print("\n".join(self.filing.items(args.n)))
        return 0

    def note(self, args: Namespace, caller: Caller) -> int:
        self.filing.note(args.n, args.item, args.insight, caller.actor)
        print(f"dump {args.n}: {args.item} noted")
        return 0

    def filed(self, args: Namespace, caller: Caller) -> int:
        dump = self.filing.filed(args.n, args.item, args.how, args.refs, args.added, caller.actor)
        print(f"dump {dump.id}: {args.item} filed" + (f", dump {dump.id} closed: {dump.outcome}" if dump.is_completed else ""))
        return 0

    def failed(self, args: Namespace, caller: Caller) -> int:
        dump = self.filing.failed(args.n, args.item, args.why, caller.actor)
        print(f"dump {dump.id}: {args.item} failed" + (f", dump {dump.id} closed: {dump.outcome}" if dump.is_completed else ""))
        return 0

    def name(self, args: Namespace, caller: Caller) -> int:
        self.filing.name(args.n, args.title, caller.actor)
        print(f"dump {args.n} named {args.title}")
        return 0

    def log(self, args: Namespace, caller: Caller) -> int:
        self.filing.log(args.n, args.status, args.on, args.making, args.detail, caller.actor)
        return 0

    def say(self, args: Namespace, caller: Caller) -> int:
        self.filing.say(args.n, args.text, caller.actor)
        return 0

    def ask(self, args: Namespace, caller: Caller) -> int:
        self.filing.ask(args.n, args.question, args.guesses, caller.actor)
        print(f"dump {args.n}: asked, the user answers in the dump window")
        return 0

    def offer(self, args: Namespace, caller: Caller) -> int:
        self.filing.offer(args.n, args.options, args.summary, caller.actor)
        return 0

    def split(self, args: Namespace, caller: Caller) -> int:
        self.filing.split(args.n, args.parts, caller.actor)
        return 0

    def answer(self, args: Namespace, caller: Caller) -> int:
        self.filing.answer(args.n, args.text, caller.actor)
        return 0

    def choose(self, args: Namespace, caller: Caller) -> int:
        self.filing.choose(args.n, args.pick, caller.actor)
        return 0

    def stop(self, args: Namespace, caller: Caller) -> int:
        print(f"dump {args.n}: {self.filing.stop(args.n, caller.actor).outcome}")
        return 0

    def remove(self, args: Namespace, caller: Caller) -> int:
        self.filing.remove(args.n, caller.actor)
        return 0

    def reopen(self, args: Namespace, caller: Caller) -> int:
        self.filing.reopen(args.n, caller.actor)
        return 0

    def dismiss(self, args: Namespace, caller: Caller) -> int:
        self.filing.dismiss(args.n, caller.actor)
        return 0
