import re

from controllers.types import Messages, Questions, Works
from engine.record import Record
from engine.worktree import git
from features.plans.controller import DONE as PLAN_DONE
from features.tickets.details import TicketsDetails
from resources.base import AGENT, SYSTEM

PLAN_DONE_CALL = "ticket_plan_done"
PEOPLE: dict = {}
WAITS_ON_PEOPLE = re.compile(r"\b(?:orchestrator|user|you|your|approv\w*|decision|decide\w*|answer\w*|review\w*"
                             r"|gebruiker|jij|jouw|goedkeur\w*|goedgekeurd|beslissing|beslis\w*|antwoord\w*|beoordel\w*)\b", re.IGNORECASE)


def handed_in(tickets, ticket) -> bool:
    from surfaces.agent_state import WORKING_STATE, agent_state
    working = agent_state(tickets.record, ticket.work_environment) == WORKING_STATE
    return tickets._plan_status(ticket) == PLAN_DONE and tickets._clean(ticket) and not working


def calls(tickets, ticket) -> list[tuple[str, str, dict, int]]:
    place = Record(tickets.record.root, ticket.work_environment)
    soon = int(TicketsDetails.values(tickets.record).remind_every)
    asks = [("ticket_asks", q.ref, {"question": q.n, "text": q.title, "env": ticket.work_environment}, soon) for q in Questions(place, actor=SYSTEM)._standing()]
    awaits = [("ticket_awaits", f"{w.n}|{w.awaiting}", {"text": w.awaiting}, soon)
              for w in Works(place, actor=SYSTEM)._standing() if w.awaiting and waits_on_people(tickets.record.root, w.awaiting)]
    messages = Messages(place, actor=SYSTEM)
    written = [messages.load(row["n"]) for row in messages.summaries() if ticket.told and row["seen"][:1] == [AGENT] and row["updated"] > ticket.told and not row["deleted"]]
    replies = [("ticket_replied", message.ref, {"text": message.title}, 0) for message in written if message.created > ticket.told]
    done = [(PLAN_DONE_CALL, f"plan:{ticket.plan}", {}, soon)] if handed_in(tickets, ticket) else []
    return asks + awaits + replies + done


def waits_on_people(root, text: str) -> bool:
    return bool(WAITS_ON_PEOPLE.search(text)) or any(name in text.lower() for name in people(root))


def people(root) -> list[str]:
    if str(root) not in PEOPLE:
        named = git(root.parent, "config", "user.name").stdout.strip().lower()
        PEOPLE[str(root)] = named.split()[:1]
    return PEOPLE[str(root)]
