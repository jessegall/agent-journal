from dataclasses import dataclass, field

from controllers.types import CONTROLLERS, Notices, Notifications, Nudges
from engine.drivers import CHANNEL, TERMINAL
from resources.base import SYSTEM, USER, titled


@dataclass
class Message:
    kind: type
    title: str
    abstract: str = ""
    brief: str = ""
    feature: str = ""
    actor: str = SYSTEM
    data: dict = field(default_factory=dict)


class Journal:
    def __init__(self, feature):
        self.feature = feature

    def say(self, record, agent, line: str, private: bool = False, actor: str = SYSTEM, delivery: str = CHANNEL, **values):
        if not self.feature.mine(agent):
            return None
        lead = self.feature.lines[line].lead
        return self.send(record, self.message(Nudges, line, values, actor, session=agent.title, private=private, lead=lead, delivery=delivery))

    def type(self, record, agent, line: str, **values):
        return self.say(record, agent, line, private=True, delivery=TERMINAL, **values)

    def whisper(self, record, agent, line: str, actor: str = SYSTEM, **values):
        return self.say(record, agent, line, private=True, actor=actor, **values)

    def notify(self, record, line: str, actor: str = SYSTEM, **values):
        return self.send(record, self.message(Notifications, line, values, actor))

    def log(self, record, line: str, **values):
        made = self.send(record, self.message(Notifications, line, values))
        return Notifications(record, actor=USER).read(made.n)

    def notice(self, record, line: str, actor: str = SYSTEM, **values):
        return self.send(record, self.message(Notices, line, values, actor))

    def clear(self, record, row, how: str) -> None:
        CONTROLLERS[row.type](record, actor=SYSTEM).complete(row.n, how=how)

    def message(self, kind: type, line: str, values: dict, actor: str = SYSTEM, **data) -> Message:
        filled = set(self.feature.lines[line].placeholders()) if line in self.feature.lines else set()
        title, brief = self.feature.line(line, {key: value for key, value in values.items() if key in filled})
        kept = {key: value for key, value in values.items() if key not in filled}
        abstract = str(kept.pop("abstract", "") or "")
        return Message(kind, title, abstract, brief, self.feature.name, actor, data={**kept, **data})

    def send(self, record, message: Message):
        return message.kind(record, actor=message.actor).create(titled(message.title), abstract=message.abstract, brief=message.brief,
                                                                feature=message.feature, **message.data)
