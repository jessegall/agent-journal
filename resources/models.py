from __future__ import annotations

from dataclasses import dataclass, field
from typing import ClassVar

import questions
import todo
from resources.base import Model


@dataclass
class Todo(Model):
    title: str = ""
    track: str = ""
    started: str = ""
    done: str = ""
    how: str = ""
    blocked: str = ""
    after: list[int] = field(default_factory=list)
    assigned: str = ""
    reported: str = ""
    doc: str = ""
    reopened: str = ""
    moved_from: str = ""
    priority: int = 0
    asks: str = ""
    answer: str = ""
    body: str = ""

    noun: ClassVar[str] = "to-do"
    sortable: ClassVar[tuple[str, ...]] = ("n", "at", "title", "priority", "started", "done")

    @classmethod
    def of(cls, n: int, row: dict) -> Todo:
        made = super().of(n, {k: v for k, v in row.items() if k not in ("after", "priority")})
        made.raw, made.after, made.priority = row, todo.after_of(row), todo.priority_of(row)
        return made

    @property
    def closed(self) -> bool:
        return bool(self.done)

    @property
    def dropped(self) -> bool:
        return self.closed and self.how.startswith("dropped")


@dataclass
class Claim(Model):
    fact: str = ""
    struck: str = ""
    session: str = ""
    doc: str = ""
    replaced: int = 0
    promoted_from: int = 0

    noun: ClassVar[str] = "pin"
    sortable: ClassVar[tuple[str, ...]] = ("n", "at", "fact")

    @property
    def standing(self) -> bool:
        return not self.struck


@dataclass
class Rule(Claim):
    noun: ClassVar[str] = "rule"


@dataclass
class Reminder(Model):
    text: str = ""
    until: str = ""
    done: str = ""
    moved_from: str = ""

    noun: ClassVar[str] = "reminder"
    sortable: ClassVar[tuple[str, ...]] = ("n", "at", "text")

    @property
    def standing(self) -> bool:
        return not self.done


@dataclass
class Question(Model):
    text: str = ""
    source: str = ""
    links: list[str] = field(default_factory=list)
    answer: str = ""
    answered_at: str = ""
    told_at: str = ""
    withdrawn: str = ""
    withdrawn_at: str = ""
    earlier_answers: list[dict] = field(default_factory=list)

    noun: ClassVar[str] = "question"
    sortable: ClassVar[tuple[str, ...]] = ("n", "at", "text", "status_order", "answered_at")

    @property
    def waiting(self) -> bool:
        return questions.is_open(self.raw)

    @property
    def status(self) -> str:
        return "withdrawn" if self.withdrawn else "answered" if self.answer else "open"

    @property
    def status_order(self) -> int:
        return ("open", "answered", "withdrawn").index(self.status)


@dataclass
class Message(Model):
    text: str = ""
    source: str = ""
    parts: list[dict] = field(default_factory=list)
    processed: str = ""

    noun: ClassVar[str] = "message"
    sortable: ClassVar[tuple[str, ...]] = ("n", "at", "processed")

    @property
    def waiting(self) -> bool:
        return not self.processed


@dataclass
class Work(Model):
    subject: str = ""
    ended: str = ""
    session: str = ""
    awaiting: dict = field(default_factory=dict)
    notes: list[dict] = field(default_factory=list)

    noun: ClassVar[str] = "work"
    sortable: ClassVar[tuple[str, ...]] = ("n", "at", "subject", "ended")

    @property
    def open(self) -> bool:
        return not self.ended


@dataclass
class Part(Model):
    title: str = ""
    slug: str = ""
    track: str = ""
    source: str = ""
    body: str = ""

    noun: ClassVar[str] = "part"
    sortable: ClassVar[tuple[str, ...]] = ("n", "at", "title")


@dataclass
class Attachment(Model):
    name: str = ""
    title: str = ""
    source: str = ""
    size: int = 0

    noun: ClassVar[str] = "attachment"
    sortable: ClassVar[tuple[str, ...]] = ("n", "at", "name", "size")


@dataclass
class Doc(Model):
    title: str = ""
    abstract: str = ""
    status: str = ""
    track: str = ""
    source: str = ""
    body: str = ""
    parts: list[Part] = field(default_factory=list)

    noun: ClassVar[str] = "doc"
    sortable: ClassVar[tuple[str, ...]] = ("n", "at", "title", "status")

    @classmethod
    def of(cls, n: int, row: dict) -> Doc:
        made = super().of(n, {k: v for k, v in row.items() if k != "parts"})
        made.raw, made.parts = row, [Part.of(p["p"], p) for p in row.get("parts") or []]
        return made
