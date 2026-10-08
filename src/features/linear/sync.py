import time
from dataclasses import dataclass, replace

from controllers.types import Comments
from features.tickets.controller import Tickets
from features.integrations.client import Answer, IntegrationClient
from features.integrations.state import IntegrationState
from features.integrations.words import BODY, COMMENT, TITLE, cleaned
from features.linear.reading import ISSUES, KNOWN, TEAMS, Issue, Reply, Team, reply_of
from features.members.words import words_from
from resources.base import Refused, SYSTEM, titled

SOURCE = "linear"
LOW = 20
GRAPHQL = "/graphql"
LEFT, DELETED, ARCHIVED = "left what you chose", "was deleted", "was archived"
CHUNK = 100


@dataclass(frozen=True)
class Choices:
    """What you chose on the card: the board the issues land on, and the teams whose issues come in."""

    board: int = 0
    teams: tuple[str, ...] = ()


@dataclass
class Limits:
    remaining: int = -1
    reset: float = 0.0

    def seen(self, answer: Answer) -> None:
        if answer.remaining >= 0:
            self.remaining, self.reset = answer.remaining, answer.reset

    def pause(self, now: float) -> float:
        return self.reset if 0 <= self.remaining < LOW and self.reset > now else 0.0


def asked(client: IntegrationClient, limits: Limits, query: str, variables: dict) -> Reply:
    answer = client.post(GRAPHQL, {"query": query, "variables": variables})
    limits.seen(answer)
    return reply_of(answer.text)


def teams_of(client: IntegrationClient) -> tuple[Team, ...]:
    return asked(client, Limits(), TEAMS, {}).data.teams.nodes


def issue_filter(choices: Choices, cursor: str) -> dict:
    found = {"assignee": {"isMe": {"eq": True}}}
    if choices.teams:
        found["team"] = {"id": {"in": list(choices.teams)}}
    if cursor:
        found["updatedAt"] = {"gt": cursor}
    return found


def changed_issues(client: IntegrationClient, limits: Limits, choices: Choices, cursor: str) -> list[Issue]:
    issues, after = [], ""
    while True:
        page = asked(client, limits, ISSUES, {"after": after or None, "filter": issue_filter(choices, cursor)}).data.issues
        issues += page.nodes
        if not page.paging.more or not page.paging.after:
            return issues
        after = page.paging.after


class TicketsFromLinear:
    """Makes or updates one ticket for each Linear issue and adds each Linear comment once, with the words wrapped as untrusted."""

    def __init__(self, record, choices: Choices):
        self.choices = choices
        self.tickets = Tickets(record, actor=SYSTEM)
        self.comments = Comments(record, actor=SYSTEM)

    def known(self) -> dict:
        return {t.source_id: t for t in self.tickets.rows.standing() if t.source == SOURCE}

    def save(self, issue: Issue):
        title = cleaned(f"{issue.identifier} {issue.title}".replace(":", " -"), TITLE)
        brief = cleaned(f"{issue.url}\n\n{issue.description}", BODY)
        with words_from(SOURCE, cleaned(issue.creator.name, TITLE)):
            ticket = self.tickets.create(title, brief=brief, source=SOURCE, source_id=issue.id, board=self.choices.board)
        if ticket.data.get("linear_gone"):
            ticket = self.tickets.update(ticket.n, linear_gone="")
        self.add_comments(ticket, issue)
        return ticket

    def add_comments(self, ticket, issue: Issue) -> None:
        had = {c.data.get("linear_id") for c in self.comments.linked_to(ticket.ref)}
        for comment in (c for c in issue.comments.nodes if c.id and c.id not in had):
            who = cleaned(comment.user.name, 40)
            with words_from(SOURCE, who):
                made = self.comments.create(titled(f"Comment from {who}" if who else "Comment from Linear"), brief=cleaned(comment.body, COMMENT),
                                            about=ticket.ref, linear_id=comment.id)
            self.tickets.save(self.tickets.load(ticket.n), "commented", comment=made.n)

    def note_gone(self, ticket, reason: str) -> None:
        if ticket.data.get("linear_gone") == reason:
            return
        made = self.comments.create("Change in Linear", brief=f"This issue {reason} in Linear. The ticket stays here.", about=ticket.ref)
        self.tickets.save(self.tickets.update(ticket.n, linear_gone=reason), "commented", comment=made.n)

    def why_gone(self, issue: Issue) -> str:
        if issue.archived:
            return ARCHIVED
        outside = self.choices.teams and issue.team.id not in self.choices.teams
        return LEFT if outside or not issue.assignee.is_me else ""


def check_gone(client: IntegrationClient, limits: Limits, work: TicketsFromLinear, seen: set[str]) -> None:
    open_tickets = [t for source_id, t in work.known().items() if source_id not in seen and not t.completed]
    for start in range(0, len(open_tickets), CHUNK):
        chunk = open_tickets[start:start + CHUNK]
        found = {n.id: n for n in asked(client, limits, KNOWN, {"filter": {"id": {"in": [t.source_id for t in chunk]}}}).data.issues.nodes}
        for ticket in chunk:
            reason = work.why_gone(found[ticket.source_id]) if ticket.source_id in found else DELETED
            if reason:
                work.note_gone(ticket, reason)


def synced(record, client: IntegrationClient, choices: Choices, state: IntegrationState, now: float | None = None) -> IntegrationState:
    """One sync: the issues changed since the last one become tickets, then the state moves on; a sync that fails part way leaves the cursor where it was."""
    now = time.time() if now is None else now
    if state.paused_until > now:
        return state
    limits, work = Limits(), TicketsFromLinear(record, choices)
    try:
        issues = changed_issues(client, limits, choices, state.cursor)
        for issue in issues:
            work.save(issue)
        check_gone(client, limits, work, {issue.id for issue in issues})
    except Refused as error:
        return replace(state, last_checked=now, last_error=str(error), failures=state.failures + 1, paused_until=limits.pause(now))
    newest = max((issue.updated for issue in issues), default=state.cursor)
    return replace(state, last_checked=now, last_error="", cursor=max(newest, state.cursor), failures=0, paused_until=limits.pause(now))
