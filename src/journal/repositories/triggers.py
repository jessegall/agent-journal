from journal.models.trigger import Trigger
from journal.models.trigger_action import TriggerAction
from journal.repositories.repository import Repository


class Triggers(Repository[Trigger]):
    model = Trigger

    def met_by(self, text: str) -> list[Trigger]:
        return [trigger for trigger in self.all() if trigger.met_by(text)]

    def starting(self, title: str) -> list[Trigger]:
        return [trigger for trigger in self.all() if trigger.action == TriggerAction.SEQUENCE and trigger.text == title]
