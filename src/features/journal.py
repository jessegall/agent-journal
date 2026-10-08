from dataclasses import dataclass, field, replace
from functools import cached_property

from controllers.base import Controller
from controllers.types import CONTROLLERS, Notices, Notifications, Nudges
from engine.wording import appended
from features.wiring import AgentHooks, Client, Commands, Events, Routes
from resources.base import SYSTEM, titled


@dataclass
class Message:
    kind: type
    title: str
    abstract: str = ""
    brief: str = ""
    feature: str = ""
    actor: str = SYSTEM
    data: dict = field(default_factory=dict)


def waiting(record, agent) -> bool:
    from controllers.types import Works
    return any(w.awaiting for w in Works(record, actor=SYSTEM).rows.standing() if w.agent in ("", agent.title))


class BoundJournal:
    def __init__(self, journal: "Journal", record, actor: str = SYSTEM):
        self.journal, self.record, self.actor = journal, record, actor

    def get(self, controller: type[Controller]) -> Controller:
        return controller(self.record, actor=self.actor)

    def acting(self, actor: str) -> "BoundJournal":
        return BoundJournal(self.journal, self.record, actor)

    def notify(self, line: str, **values):
        return self.journal.notify(self.record, line, actor=self.actor, **values)

    def notice(self, line: str, **values):
        return self.journal.notice(self.record, line, actor=self.actor, **values)

    def log(self, line: str, **values):
        return self.journal.log(self.record, line, **values)

    def clear(self, row, how: str) -> None:
        self.journal.clear(self.record, row, how)


class Journal:
    def __init__(self, feature):
        self.feature = feature

    def at(self, record, actor: str = SYSTEM) -> BoundJournal:
        return BoundJournal(self, record, actor)

    @cached_property
    def routes(self) -> Routes:
        return Routes(self.feature)

    @cached_property
    def events(self) -> Events:
        return Events(self.feature)

    @cached_property
    def client(self) -> Client:
        return Client(self.feature)

    @cached_property
    def commands(self) -> Commands:
        return Commands(self.feature)

    @cached_property
    def agent(self) -> AgentHooks:
        return AgentHooks(self.feature)

    def say(self, record, agent, line: str, private: bool = False, actor: str = SYSTEM, **values):
        spec = self.feature.declared_line(line)
        if not spec.reach.reaches(agent.subagent) or (not spec.while_waiting and waiting(record, agent)):
            return None
        lead, yields = spec.lead, not spec.while_waiting
        message = self.message(Nudges, line, values, actor, session=agent.title, private=private, lead=lead, yields=yields, reply_kept=spec.reply_kept,
                               **spec.asking(self.feature.name))
        added = appended(f"{self.feature.name}.{line}", {**values, "record": record}, "").removeprefix(" - ")
        said = replace(message, brief=". ".join(part for part in (added, message.brief) if part))
        if Nudges(record, actor=SYSTEM)._repeats_last(agent.title, titled(said.title), said.brief, agent.at):
            return None
        return self.send(record, said)

    def whisper(self, record, agent, line: str, actor: str = SYSTEM, **values):
        return self.say(record, agent, line, private=True, actor=actor, **values)

    def notify(self, record, line: str, actor: str = SYSTEM, **values):
        return self.send(record, self.message(Notifications, line, values, actor))

    def log(self, record, line: str, **values):
        message = self.message(Notifications, line, values)
        return Notifications(record, actor=message.actor)._logged(titled(message.title), brief=message.brief, abstract=message.abstract,
                                                                  feature=message.feature, **message.data)

    def notice(self, record, line: str, actor: str = SYSTEM, **values):
        return self.send(record, self.message(Notices, line, values, actor))

    def clear(self, record, row, how: str) -> None:
        CONTROLLERS[row.type](record, actor=SYSTEM).complete(row.n, how=how)

    def message(self, kind: type, line: str, values: dict, actor: str = SYSTEM, **data) -> Message:
        spec = self.feature.declared_line(line)
        filled = set(spec.placeholders())
        title, brief = spec.filled({key: value for key, value in values.items() if key in filled})
        kept = {key: value for key, value in values.items() if key not in filled}
        abstract = str(kept.pop("abstract", ""))
        if spec.label:
            kept["label"] = spec.label
        return Message(kind, title, abstract, brief, self.feature.name, actor, data={**kept, **data})

    def send(self, record, message: Message):
        return message.kind(record, actor=message.actor).create(titled(message.title), abstract=message.abstract, brief=message.brief,
                                                                feature=message.feature, **message.data)
