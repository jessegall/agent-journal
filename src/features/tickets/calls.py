import re

from controllers.types import Agents, Messages, Questions, Works
from engine.record import Record
from engine.worktree import git
from resources.plans import DONE as PLAN_DONE
from features.tickets.details import TicketsDetails
from payload import HookEvent
from resources.base import AGENT, SYSTEM
from controllers.agents import WORKING_STATE

PLAN_DONE_CALL = "ticket_plan_done"
PEOPLE: dict = {}
WAITS_ON_PEOPLE = re.compile(r"\b(?:orchestrator|user|you|your|approv\w*|decision|decide\w*|answer\w*|review\w*"
                             r"|gebruiker|jij|jouw|goedkeur\w*|goedgekeurd|beslissing|beslis\w*|antwoord\w*|beoordel\w*)\b", re.IGNORECASE)


NEEDS_THE_USER = re.compile(r"\b(?:secrets?|passwords?|credentials?|tokens?|api[ -]?keys?|logins?|2fa|production|prod|live\s+(?:site|server|data)|deploy\w*|release\w*|publish\w*"
                            r"|send\w*\s+(?:an?\s+)?(?:e-?mail|message|invoice)|e-?mails?|payments?|billing|invoice\w*|refund\w*|spend\w*|purchase\w*|force[- ]push"
                            r"|delete\w*\s+(?:the\s+)?(?:data|database|branch)|wachtwoord|geheim\w*|productie|betaling\w*)\b", re.IGNORECASE)
DECIDE = ("decide it yourself and write down what you chose: journal --env {env} question answer {question} --how \"<choice>\" --set reason=\"<what you chose and why>\"; "
          "its agent is told the answer at once, and it is the answer, so do not ask the user")
ASK_THE_USER = ("this one is the user's: its agent marked it so, or it asks for a secret or a login, or for something outward-facing or in production, "
                "so put it to them in a question of your own and answer it with what they say")
SAYS = ("answer it when it is yours to decide with journal --env {env} question answer {question} --how \"<choice>\" --set reason=\"<why>\"; "
        "its agent is told the answer at once. Otherwise ask the user")


def needs_the_user(question) -> bool:
    """Whether a ticket agent's question is the user's whatever the mode: the agent marked it so when it filed it, which is the line, or, for one that does not think to, its words name a secret or login, anything outward-facing or in production, or money."""
    return bool(question.for_user) or bool(NEEDS_THE_USER.search(f"{question.title} {question.brief}"))


def deciding(record) -> bool:
    """Whether the orchestrator answers its ticket agents' questions itself: auto mode on and the work mode orchestrator."""
    from features.work_modes.details import ORCHESTRATOR
    from features.work_modes.modes import mode_of
    from features.work_tracking.auto import automatic
    return automatic(record) and mode_of(record) == ORCHESTRATOR


def rule_for(tickets, question, env) -> str:
    if needs_the_user(question):
        return ASK_THE_USER
    return (DECIDE if deciding(tickets.record) else SAYS).format(env=env, question=question.n)


def handed_in(tickets, ticket) -> bool:
    working = Agents(tickets.record, actor=SYSTEM).state(ticket.work_environment) == WORKING_STATE
    return tickets._plan_status(ticket) == PLAN_DONE and tickets._clean(ticket) and not working


def calls(tickets, ticket) -> list[tuple[str, str, dict, int]]:
    place = Record(tickets.record.root, ticket.work_environment)
    soon = int(TicketsDetails.values(tickets.record).remind_every)
    asks = [("ticket_asks", q.ref, {"question": q.n, "text": q.title, "env": ticket.work_environment, "rule": rule_for(tickets, q, ticket.work_environment)}, soon)
            for q in Questions(place, actor=SYSTEM).rows.standing()]
    awaits = [("ticket_awaits", f"{w.n}|{w.awaiting}", {"text": w.awaiting}, soon)
              for w in Works(place, actor=SYSTEM).rows.standing() if w.awaiting and waits_on_people(tickets.record.root, w.awaiting)]
    messages = Messages(place, actor=SYSTEM)
    written = [messages.peek(row["n"]) for row in messages.rows.summaries() if ticket.told and row["seen"][:1] == [AGENT] and row["updated"] > ticket.told and not row["deleted"]]
    replies = [("ticket_replied", message.ref, {"text": message.title}, 0) for message in written if message.created > ticket.told]
    replies += ended_turns(place, ticket)
    done = [(PLAN_DONE_CALL, f"plan:{ticket.plan}", {}, soon)] if handed_in(tickets, ticket) else []
    return asks + awaits + replies + done


def ended_turns(place: Record, ticket) -> list[tuple[str, str, dict, int]]:
    """The last report of a ticket's agent when its turn ended after the orchestrator last spoke to it, whichever of its agent rows ended it, so a final report is never lost for lack of a message."""
    stopped = [row for row in Agents(place, actor=SYSTEM).rows.every()
               if row.event == HookEvent.STOP and row.last_message and float(row.at) > ticket.told]
    if not stopped:
        return []
    last = max(stopped, key=lambda row: float(row.at))
    return [("ticket_replied", f"turn:{last.n}:{int(float(last.at))}", {"text": last.last_message[:300]}, 0)]


def waits_on_people(root, text: str) -> bool:
    return bool(WAITS_ON_PEOPLE.search(text)) or any(name in text.lower() for name in people(root))


def people(root) -> list[str]:
    if str(root) not in PEOPLE:
        named = git(root.parent, "config", "user.name").stdout.strip().lower()
        PEOPLE[str(root)] = named.split()[:1]
    return PEOPLE[str(root)]
