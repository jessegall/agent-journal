from dataclasses import dataclass, field

from controllers.types import Notices, Notifications, Nudges
from resources.base import SYSTEM, USER, titled

KINDS = {"nudge": Nudges, "notification": Notifications, "notice": Notices}
CHANNEL, TERMINAL = "channel", "terminal"


@dataclass
class Message:
    kind: str
    title: str
    brief: str = ""
    feature: str = ""
    actor: str = SYSTEM
    seen: bool = False
    data: dict = field(default_factory=dict)


class Journal:
    def __init__(self, feature):
        self.feature = feature

    def say(self, record, agent, line: str, private: bool = False, actor: str = SYSTEM, delivery: str = CHANNEL, **values):
        if not self.feature.mine(agent):
            return None
        lead = self.feature.lines[line].lead
        return self.send(record, self.message("nudge", line, values, actor, session=agent.title, private=private, lead=lead, delivery=delivery))

    def type(self, record, agent, line: str, **values):
        return self.say(record, agent, line, private=True, delivery=TERMINAL, **values)

    def whisper(self, record, agent, line: str, actor: str = SYSTEM, **values):
        return self.say(record, agent, line, private=True, actor=actor, **values)

    def notify(self, record, line: str, actor: str = SYSTEM, **values):
        return self.send(record, self.message("notification", line, values, actor))

    def log(self, record, line: str, **values):
        message = self.message("notification", line, values)
        message.seen = True
        return self.send(record, message)

    def notice(self, record, line: str, actor: str = SYSTEM, **values):
        return self.send(record, self.message("notice", line, values, actor))

    def clear(self, record, row, how: str) -> None:
        KINDS[row.type](record, actor=SYSTEM).complete(row.n, how=how)

    def message(self, kind: str, line: str, values: dict, actor: str = SYSTEM, **data) -> Message:
        filled = set(self.feature.lines[line].placeholders()) if line in self.feature.lines else set()
        title, brief = self.feature.line(line, {key: value for key, value in values.items() if key in filled})
        kept = {key: value for key, value in values.items() if key not in filled}
        return Message(kind, title, brief, self.feature.name, actor, data={**kept, **data})

    def send(self, record, message: Message):
        rows = KINDS[message.kind](record, actor=message.actor)
        abstract = str(message.data.pop("abstract", "") or "")
        made = rows.create(titled(message.title), abstract=abstract, brief=message.brief, feature=message.feature, **message.data)
        return KINDS[message.kind](record, actor=USER).read(made.n) if message.seen else made
