from __future__ import annotations

from pathlib import Path
from typing import Iterable

import browser
import comments
import connections
import docs
import inbox
import notices
import notifications
import pins
import plans
import reports
import suggestions
import questions
import reminders
import style
import todo
import tools
import work
from resources.base import Query, Repository
from resources.models import Attachment, BrowserAsk, Claim, Comment, Connection, Doc, Notice, Notification, Report, Suggestion, Message, Part, Plan, Question, Reminder, Rule, StyleItem, Todo, Tool, Work


class Todos(Repository[Todo]):
    model = Todo

    def rows(self) -> list[dict]:
        return todo._all(self.root, self.env)

    def numbered(self) -> Iterable[tuple[int, dict]]:
        return ((row["n"], row) for row in self.rows())

    def find(self, n: int) -> Todo | None:
        row, _ = todo.item(self.root, self.env, n)
        return Todo.of(n, row) if row else None


class Pins(Repository[Claim]):
    model = Claim
    key = pins.KEY

    def rows(self) -> list[dict]:
        return pins._all(self.root, self.key, self.env or None)

    def reasoning(self, n: int) -> str:
        return pins.body(self.root, n, self.key, track=self.env or None)


class Rules(Pins):
    model = Rule
    key = pins.RULES

    def __init__(self, root: Path, env: str = ""):
        super().__init__(root, "")


class Reminders(Repository[Reminder]):
    model = Reminder

    def rows(self) -> list[dict]:
        return reminders._all(self.root, self.env or None)


class Questions(Repository[Question]):
    model = Question

    def rows(self) -> list[dict]:
        return questions._all(self.root, self.env or None)

    def about(self, ref: str) -> Query[Question]:
        return self.query().where(lambda q: ref in q.links and not q.withdrawn)


class Suggestions(Repository[Suggestion]):
    model = Suggestion

    def rows(self) -> list[dict]:
        return suggestions._all(self.root, self.env or None)


class Notifications(Repository[Notification]):
    model = Notification

    def rows(self) -> list[dict]:
        return notifications._all(self.root, self.env or None)


class BrowserAsks(Repository[BrowserAsk]):
    model = BrowserAsk

    def rows(self) -> list[dict]:
        return browser._all(self.root, self.env or None)


class Notices(Repository[Notice]):
    model = Notice

    def rows(self) -> list[dict]:
        return notices._all(self.root, self.env or None)


class Reports(Repository[Report]):
    model = Report

    def rows(self) -> list[dict]:
        return reports._all(self.root, self.env or None)


class Plans(Repository[Plan]):
    model = Plan

    def rows(self) -> list[dict]:
        return plans._all(self.root, self.env or None)


class Comments(Repository[Comment]):
    model = Comment

    def rows(self) -> list[dict]:
        return comments._all(self.root, self.env or None)


class Messages(Repository[Message]):
    model = Message

    def rows(self) -> list[dict]:
        return inbox._all(self.root, self.env or None)


class WorkLog(Repository[Work]):
    model = Work

    def rows(self) -> list[dict]:
        return work._all(self.root, self.env or None)


class ToolCatalogue(Repository[Tool]):
    model = Tool

    def rows(self) -> list[dict]:
        return tools.all_tools(self.root)


class Connections(Repository[Connection]):
    """The project's connections, as this environment reads them: its overrides already applied."""
    model = Connection

    def rows(self) -> list[dict]:
        return list(connections.all_of(self.root, self.env or None).values())


class Docs(Repository[Doc]):
    model = Doc

    def rows(self) -> list[dict]:
        return docs._load(self.root)

    def numbered(self) -> Iterable[tuple[int, dict]]:
        return ((row["n"], row) for row in self.rows())

    def on(self, env: str) -> Query[Doc]:
        return self.query().where(lambda d: docs.here(d.raw, env))

    def parts(self, n: int) -> Parts:
        return Parts(self.root, n)

    def attachments(self, n: int) -> Attachments:
        return Attachments(self.root, n)


class _OfDoc:
    def __init__(self, root: Path, doc: int):
        self.root, self.env, self.doc = root, "", doc

    def _doc(self) -> dict | None:
        return next((d for d in docs._load(self.root) if d["n"] == self.doc), None)


class Parts(_OfDoc, Repository[Part]):
    model = Part

    def rows(self) -> list[dict]:
        got = self._doc()
        return got.get("parts") or [] if got else []

    def numbered(self) -> Iterable[tuple[int, dict]]:
        return ((row["p"], row) for row in self.rows())


class Attachments(_OfDoc, Repository[Attachment]):
    model = Attachment

    def rows(self) -> list[dict]:
        got = self._doc()
        return docs.attachments(got) if got else []


class StyleBook(Repository[StyleItem]):
    model = StyleItem

    def rows(self) -> list[dict]:
        return style.all_items(self.root)
