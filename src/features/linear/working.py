import time
from dataclasses import asdict, replace

from engine import bus
from features.integrations.state import IntegrationState, read_state, write_state
from features.linear.sync import Choices, StageState, TicketsFromLinear, issue_of, send_comment, send_status, synced, teams_of
from features.linear.webhook import event_of
from features.routing import Reply, Request, handles
from features.secrets.values import ValuesFile
from features.sharing.address import own_address
from features.sharing.tunnel import kept_address
from features.tickets.controller import Tickets
from resources.base import Refused, SYSTEM

CATCH_UP = 30 * 60.0


class LinearWork:
    """What the Linear feature does, kept out of the feature itself: choosing, syncing, sending, taking a webhook, and the routes the card calls."""

    def choices(self, record) -> Choices:
        values = self.values(record)
        stages = tuple(StageState(stage, state) for stage, state in dict(values.stage_states).items() if state)
        return Choices(int(values.board), tuple(part for part in str(values.teams).split(",") if part), stages)

    def deliver(self, client, ticket, text: str) -> None:
        send_comment(client, ticket.source_id, text)

    def ticked(self, record) -> None:
        self.check(record, catching_up=True)

    def move_issue(self, record, n: int) -> None:
        tickets = Tickets(record, actor=SYSTEM)
        ticket = tickets.load(n)
        if ticket.source != "linear" or ticket.data.get("linear_stage") == ticket.stage:
            return
        state = self.choices(record).state_of(ticket.stage)
        sending = bool(self.values(record).send_status) and bool(state)
        agreed = {"linear_stage": ticket.stage}
        if sending:
            agreed["linear_state"] = state
        tickets.update(ticket.n, **agreed)
        if sending:
            bus.defer(lambda: self.push(record, lambda client: send_status(client, ticket.source_id, state)))

    def webhook_address(self, record) -> str:
        """Where Linear is told to deliver events: the journal's tunnel address, or nothing while it has none."""
        own = own_address(record)
        kept = kept_address(record.root)
        host = own[0] if own else ".".join(kept[part] for part in ("subdomain", "host") if kept.get(part))
        return f"https://{host}/linear/webhook" if host and (own or kept.get("subdomain")) else ""

    def signing_secret(self, record) -> str:
        return ValuesFile(record.root).values().get(str(self.values(record).signing_key), "")

    def waits_for_webhook(self, record) -> bool:
        return bool(self.webhook_address(record)) and bool(self.signing_secret(record))

    def take(self, record, body: bytes, signature: str) -> None:
        """A signed, fresh event for an issue: the issue is fetched from the API and saved the way a sync saves it; the event itself is only a hint."""
        event = event_of(body, signature, self.signing_secret(record), time.time())
        if not self.deliveries.fresh(signature, time.time()):
            raise Refused("the event was already taken")
        if event.kind != "Issue" or not event.data.id:
            return
        choices = self.choices(record)
        if not choices.board:
            return
        issue = issue_of(self.client(record), event.data.id)
        if issue is None:
            return
        work = TicketsFromLinear(record, choices)
        if reason := work.why_gone(issue):
            known = work.known().get(issue.id)
            if known:
                work.note_gone(known, reason)
        else:
            work.save(issue)
        write_state(record.root, self.name, replace(read_state(record.root, self.name), webhook_at=time.time()))

    def check(self, record, catching_up: bool = False) -> IntegrationState:
        """One sync now: nothing when no key or no board is picked, and while the webhook delivers, the clock only catches up every half hour; failures are noticed once until a sync works again."""
        before = read_state(record.root, self.name)
        choices = self.choices(record)
        if not str(self.values(record).key) or not choices.board or not self.values(record).fetching:
            return before
        if catching_up and self.waits_for_webhook(record) and time.time() - before.last_checked < CATCH_UP:
            return before
        after = synced(record, self.client(record), choices, before)
        write_state(record.root, self.name, after)
        self.notice_failure(record, before, read_state(record.root, self.name))
        return read_state(record.root, self.name)

    def teams_route(self):
        @handles("GET", "/api/{env}/integration/linear/teams")
        def get_teams(req: Request) -> Reply:
            return Reply(200, [asdict(team) for team in teams_of(self.client(req.record()))])

        return get_teams

    def webhook_route(self):
        @handles("GET", "/api/{env}/integration/linear/webhook")
        def get_webhook(req: Request) -> Reply:
            return Reply(200, {"address": self.webhook_address(req.record())})

        return get_webhook
