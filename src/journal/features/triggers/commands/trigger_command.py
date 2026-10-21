from argparse import Namespace

from journal.console.command import Command
from journal.support.caller import Caller
from journal.models.trigger import Trigger
from journal.models.trigger_action import TriggerAction
from journal.repositories.triggers import Triggers


class TriggerCommand(Command):
    noun = "trigger"

    def __init__(self, triggers: Triggers) -> None:
        self.triggers = triggers

    def arguments(self, verbs) -> None:
        new_trigger = self.verb(verbs, "create", "watch for words")
        new_trigger.add_argument("phrases", help="comma-separated")
        new_trigger.add_argument("text", help="the line said, or for --do sequence the title of the sequence to start")
        new_trigger.add_argument("--do", choices=[action.value for action in TriggerAction], default=TriggerAction.NUDGE.value)
        self.verb(verbs, "list", "every trigger")
        self.verb(verbs, "strike", "stop watching").add_argument("n", type=int)

    def create(self, args: Namespace, caller: Caller) -> int:
        phrases = tuple(w.strip() for w in args.phrases.split(",") if w.strip())
        trigger = self.triggers.save(Trigger(phrases=phrases, action=TriggerAction(args.do), text=args.text), caller.actor)
        print(f"trigger {trigger.id}: {', '.join(phrases)} -> {trigger.action}")
        return 0

    def list(self, args: Namespace, caller: Caller) -> int:
        for trigger in self.triggers.all():
            print(f"{trigger.id:>4}  {trigger.action:<8} {', '.join(trigger.phrases)}: {trigger.text}")
        return 0

    def strike(self, args: Namespace, caller: Caller) -> int:
        self.triggers.delete(self.triggers.find(args.n), caller.actor)
        print(f"trigger {args.n} struck")
        return 0
