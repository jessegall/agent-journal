from journal.models.trigger import Trigger
from journal.repositories.repository import Repository


class Triggers(Repository[Trigger]):
    model = Trigger

    def met_by(self, text: str) -> list[Trigger]:
        return [trigger for trigger in self.all() if trigger.met_by(text)]
