from typing import ClassVar
from dataclasses import dataclass, field

from journal.events.rows.dump_answered import DumpAnswered
from journal.events.rows.dump_arrived import DumpArrived
from journal.events.rows.dump_question import DumpQuestion
from journal.events.rows.dump_choice import DumpChoice
from journal.events.rows.dump_sorted import DumpSorted
from journal.models.support.dump_item import DumpItem
from journal.models.scoped import Scoped

TEXT = "text"

USER_TEXT = -2


@dataclass(frozen=True)
class Dump(Scoped):
    """A pile the user drops in one place, which the agent sorts by subject and files as rows of their own."""

    text_fields: ClassVar[tuple[str, ...]] = ("title", "brief", "summary", "outcome")
    title: str = ""
    brief: str = ""
    files: tuple[str, ...] = ()
    parts: tuple[str, ...] = ()
    items: dict = field(default_factory=dict)
    log: tuple = ()
    question: dict = field(default_factory=dict)
    answers: tuple = ()
    options: tuple = ()
    chosen: dict = field(default_factory=dict)
    taken: dict = field(default_factory=dict)
    declined: tuple = ()
    said: tuple = ()
    summary: str = ""
    outcome: str = ""
    queued_at: float = 0.0
    completed_at: float = 0.0
    stopped: bool = False
    dismissed: bool = False
    removed_at: float = 0.0
    removed_refs: tuple = ()

    @property
    def is_completed(self) -> bool:
        return bool(self.completed_at)

    @property
    def item_names(self) -> list[str]:
        return ((list(self.parts) or [TEXT]) if self.brief.strip() else []) + sorted(self.files)

    def item(self, name: str) -> DumpItem:
        return DumpItem.build(self.items.get(name) or {})

    def with_item(self, name: str, **values) -> "Dump":
        return self.with_(items={**self.items, name: {**self.item(name).serialized(), **values}})

    @property
    def is_complete(self) -> bool:
        settled = [self.item(name).resolved for name in self.item_names]
        return bool(settled) and all(settled)

    def waiting(self) -> list[str]:
        return [name for name in self.item_names if not self.item(name).insight]

    def open_items(self) -> list[str]:
        return [name for name in self.item_names if not self.item(name).resolved]

    def arrived(self, time: float, by_user: bool) -> "Dump":
        return self.with_event(DumpArrived(environment_id=self.environment_id, time=time, dump_id=self.id, waiting=len(self.waiting()), by_user=by_user))

    def posed_question(self, text: str, guesses: list[str], time: float) -> "Dump":
        return self.with_(question={"time": time, "text": text, "guesses": guesses}).with_event(DumpQuestion(environment_id=self.environment_id, time=time, dump_id=self.id))

    def answered(self, answer: str, time: float) -> "Dump":
        question = self.question.get("text", "")
        return self.with_(question={}, answers=(*self.answers, {"question": question, "answer": answer, "time": time})).with_event(DumpAnswered(environment_id=self.environment_id, time=time, dump_id=self.id, question=question, answer=answer))

    def step_chosen(self, pick: int, label: str, time: float) -> "Dump":
        choice = {"label": label, "pick": pick, "time": time}
        taken = {**self.taken, str(pick): choice} if pick >= 0 else self.taken
        return self.with_(chosen=choice, taken=taken).with_event(DumpChoice(environment_id=self.environment_id, time=time, dump_id=self.id, pick=pick, label=label))

    def step_directed(self, label: str, time: float) -> "Dump":
        choice = {"label": label, "pick": USER_TEXT, "time": time}
        return self.with_(chosen=choice, said=(*self.said, choice)).with_event(DumpChoice(environment_id=self.environment_id, time=time, dump_id=self.id, pick=USER_TEXT, label=label))

    def filed(self, how: str, time: float) -> "Dump":
        return self.with_(completed_at=time, outcome=how).with_event(DumpSorted(environment_id=self.environment_id, time=time, dump_id=self.id, outcome=how, stopped=self.stopped))

    @staticmethod
    def item_rows(names: list[str]) -> str:
        return f"{len(names)} item{'s' * (len(names) != 1)}"

    def logged(self, entry: dict, kept: int) -> "Dump":
        return self.with_(log=(*self.log, entry)[-kept:])

    def created_refs(self) -> list[str]:
        refs = [ref for name in self.item_names for ref in self.item(name).refs] + [e["on"] for e in self.log if e.get("on")]
        return list(dict.fromkeys(refs))

    def title_words(self) -> str:
        return self.title

    def summary_line(self) -> str:
        return self.first_line(self.brief)
