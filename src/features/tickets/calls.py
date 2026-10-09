import re

from controllers.types import Agents, Messages, Questions, Works
from engine.record import Record
from engine.worktree import git
from features.plans.controller import DONE as PLAN_DONE
from features.tickets.details import TicketsDetails
from providers.payload import HookEvent
from resources.base import AGENT, SYSTEM
from controllers.agents import WORKING_STATE

PLAN_DONE_CALL = "ticket_plan_done"
PEOPLE: dict = {}
WAITS_ON_PEOPLE = re.compile(r"\b(?:orchestrator|user|you|your|approv\w*|decision|decide\w*|answer\w*|review\w*"
                             r"|gebruiker|jij|jouw|goedkeur\w*|goedgekeurd|beslissing|beslis\w*|antwoord\w*|beoordel\w*)\b", re.IGNORECASE)


def handed_in(tickets, ticket) -> bool:
    working = Agents(tickets.record, actor=SYSTEM).state(ticket.work_environment) == WORKING_STATE
    return tickets._plan_status(ticket) == PLAN_DONE and tickets._clean(ticket) and not working


def calls(tickets, ticket) -> list[tuple[str, str, dict, int]]:
    place = Record(tickets.record.root, ticket.work_environment)
    soon = int(TicketsDetails.values(tickets.record).remind_every)
    asks = [("ticket_asks", q.ref, {"question": q.n, "text": q.title, "env": ticket.work_environment}, soon) for q in Questions(place, actor=SYSTEM).rows.standing()]
    awaits = [("ticket_awaits", f"{w.n}|{w.awaiting}", {"text": w.awaiting}, soon)
              for w in Works(place, actor=SYSTEM).rows.standing() if w.awaiting and waits_on_people(tickets.record.root, w.awaiting)]
    messages = Messages(place, actor=SYSTEM)
    written = [messages.load(row["n"]) for row in messages.rows.summaries() if ticket.told and row["seen"][:1] == [AGENT] and row["updated"] > ticket.told and not row["deleted"]]
    replies = [("ticket_replied", message.ref, {"text": message.title}, 0) for message in written if message.created > ticket.told]
    replies += ended_turns(place, ticket)
    done = [(PLAN_DONE_CALL, f"plan:{ticket.plan}", {}, soon)] if handed_in(tickets, ticket) else []
    return asks + awaits + replies + done


def ended_turns(place: Record, ticket) -> list[tuple[str, str, dict, int]]:
    """The last report of a ticket's agent when its turn ended after the orchestrator last spoke to it, whichever of its agent rows ended it, so a final report is never lost for lack of a message."""
    stopped = [row for row in Agents(place, actor=SYSTEM).rows.every()
               if row.data.get("event") == HookEvent.STOP and row.data.get("last_message") and float(row.data.get("at") or 0) > float(ticket.told or 0)]
    if not stopped:
        return []
    last = max(stopped, key=lambda row: float(row.data.get("at") or 0))
    return [("ticket_replied", f"turn:{last.n}:{int(float(last.data['at']))}", {"text": last.data["last_message"][:300]}, 0)]


def waits_on_people(root, text: str) -> bool:
    return bool(WAITS_ON_PEOPLE.search(text)) or any(name in text.lower() for name in people(root))


def people(root) -> list[str]:
    if str(root) not in PEOPLE:
        named = git(root.parent, "config", "user.name").stdout.strip().lower()
        PEOPLE[str(root)] = named.split()[:1]
    return PEOPLE[str(root)]
