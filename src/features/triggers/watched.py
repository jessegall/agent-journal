import time
from dataclasses import dataclass
from typing import Callable

from controllers.types import Messages, Questions, Works
from engine.memo import Memo
from features.messages.answering import unanswered
from features.base import PLACEHOLDER
from features.sending import Sent
from features.trigger import MINUTE
from features.work_tracking.next import ready
from resources.base import AGENT, SYSTEM

MINUTES, PERCENT, COUNT = "minutes", "percent", "count"
FOUND = Memo(limit=256)


@dataclass(frozen=True)
class Fact:
    name: str
    unit: str
    label: str
    phrase: str
    find: Callable

    def sentence(self, over: float) -> str:
        return self.phrase.format(over=int(over))


def filled(text: str, values: dict) -> str:
    return PLACEHOLDER.sub(lambda found: str(values.get(found.group(1), found.group(0))), text)


def minutes_since(stamp: float) -> int:
    return int((time.time() - stamp) / MINUTE)


def aged(rows: list, since: Callable, over: float) -> list[Sent]:
    return [Sent(str(row.n), {"n": row.n, "title": row.title, "minutes": minutes_since(since(row))}) for row in rows if minutes_since(since(row)) > over]


def open_work(context) -> list:
    return [work for work in context.journal.get(Works).rows.standing() if not work.parked]


def message_unread(context, agent, over: float) -> list[Sent]:
    return aged(context.journal.get(Messages).unread(AGENT), lambda row: row.created, over)


def message_unanswered(context, agent, over: float) -> list[Sent]:
    return aged(unanswered(context.journal), lambda row: row.created, over)


def work_unlogged(context, agent, over: float) -> list[Sent]:
    return aged(open_work(context), lambda work: work.logged or work.created, over)


def work_awaiting(context, agent, over: float) -> list[Sent]:
    return aged([work for work in open_work(context) if work.awaiting], lambda work: work.awaiting_since, over)


def agent_idle(context, agent, over: float) -> list[Sent]:
    return [Sent(agent.title, {"title": agent.title, "minutes": int(agent.idle_for / MINUTE)})] if agent.idle_for > over * MINUTE else []


def agent_context(context, agent, over: float) -> list[Sent]:
    return [Sent(agent.title, {"title": agent.title, "percent": int(float(agent.context))})] if float(agent.context) > over else []


def question_open(context, agent, over: float) -> list[Sent]:
    return aged([question for question in Questions(context.record, actor=SYSTEM).rows.standing() if not question.hidden], lambda row: row.created, over)


def todo_ready(context, agent, over: float) -> list[Sent]:
    rows = ready(context.record)
    if open_work(context) or len(rows) < over:
        return []
    return [Sent("ready", {"n": rows[0].n, "title": rows[0].title, "count": len(rows)})]


FACTS = {fact.name: fact for fact in (
    Fact("message.unread", MINUTES, "A message of yours has not been read", "a message of yours has gone unread for more than {over} minutes", message_unread),
    Fact("message.unanswered", MINUTES, "A message of yours was read but not answered", "a message of yours has been read but left unanswered for more than {over} minutes", message_unanswered),
    Fact("work.unlogged", MINUTES, "Work has no log entry", "work has had no log entry for more than {over} minutes", work_unlogged),
    Fact("work.awaiting", MINUTES, "Work has been waiting for something", "work has been waiting for something for more than {over} minutes", work_awaiting),
    Fact("agent.idle", MINUTES, "The agent has been idle", "the agent has been idle for more than {over} minutes", agent_idle),
    Fact("agent.context", PERCENT, "The agent's context is getting full", "the agent's context is more than {over} percent full", agent_context),
    Fact("question.open", MINUTES, "A question has no answer", "a question has had no answer for more than {over} minutes", question_open),
    Fact("todo.ready", COUNT, "To-dos are ready and no work is open", "at least {over} to-dos are ready and no work is open", todo_ready),
)}


def found(name: str, context, agent, over: float) -> list[Sent]:
    fact = FACTS[name]
    if context.hook is None:
        return fact.find(context, agent, over)
    return FOUND.get((str(context.record.root), context.record.env, name, over, id(context.hook)), context.hook, lambda: fact.find(context, agent, over))
