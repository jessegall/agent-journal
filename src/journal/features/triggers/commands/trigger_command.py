from argparse import Namespace

from journal.console.command import Command
from journal.console.where import Where
from journal.models.trigger import Trigger
from journal.models.trigger_action import TriggerAction
from journal.repositories.triggers import Triggers


class TriggerCommand(Command):
    noun = "trigger"

    def __init__(self, triggers: Triggers) -> None:
        self.triggers = triggers

    def arguments(self, verbs) -> None:
        create = self.verb(verbs, "create", "watch for words")
        create.add_argument("words", help="comma-separated")
        create.add_argument("text")
        create.add_argument("--do", choices=[a.value for a in TriggerAction], default=TriggerAction.NUDGE.value)
        self.verb(verbs, "list", "every trigger")
        self.verb(verbs, "strike", "stop watching").add_argument("n", type=int)

    def create(self, args: Namespace, where: Where) -> int:
        words = tuple(w.strip() for w in args.words.split(",") if w.strip())
        trigger = self.triggers.save(Trigger(words=words, action=TriggerAction(args.do), text=args.text), where.actor)
        print(f"trigger {trigger.id}: {', '.join(words)} -> {trigger.action}")
        return 0

    def list(self, args: Namespace, where: Where) -> int:
        for trigger in self.triggers.all():
            print(f"{trigger.id:>4}  {trigger.action:<8} {', '.join(trigger.words)}: {trigger.text}")
        return 0

    def strike(self, args: Namespace, where: Where) -> int:
        self.triggers.delete(self.triggers.find(args.n), where.actor)
        print(f"trigger {args.n} struck")
        return 0
