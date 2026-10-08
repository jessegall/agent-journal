from dataclasses import asdict, dataclass
from functools import partial
from urllib.parse import parse_qs

from engine import runtime
from engine.fields import Loaded
from engine.paths import known_environment
from engine.record import Record
from controllers.shared import environment_of
from features.hosted_journal.gateway import COOKIE, Gateway, Visit
from features.hosted_journal.owner import KeptLogin
from features.hosted_journal.pages import Notice, notice_page
from features.hosted_journal.people import Act, PageHandler
from features.hosted_journal.vault import Vault
from features.members.pages import BELOW_LOGIN, join_page, member_login_page
from features.members.roles import OWNER_ABILITIES, Abilities, Role
from features.members.roster import Departure, Roster
from features.routing import MEMBER, SHARED
from features.phone.allow_list import Action, Page
from resources.base import OWNER_ID, Resource, as_dict

OWNER_NAME = "Owner"
NOT_A_MEMBER = "You are no longer a member of this journal."
NOT_SHARED = "The owner has not shared this environment with you."


@dataclass(frozen=True)
class Invited(Loaded):
    name: str = ""
    role: str = Role.WRITER.value


@dataclass(frozen=True)
class Assigned(Loaded):
    member: str = ""
    role: str = ""


@dataclass(frozen=True)
class Picked(Loaded):
    member: str = ""


@dataclass(frozen=True)
class Shared(Loaded):
    member: str = ""
    environments: tuple[str, ...] = ()


@dataclass(frozen=True)
class Someone:
    """Who a login belongs to, and what they can do, as the viewer shows it."""

    member: str
    name: str
    role: str
    owner: bool
    abilities: Abilities


def environments_named(visit: Visit) -> set[str]:
    """The environments a request reaches into, by its address or its query."""
    reached = visit.reached()
    named = {reached.params.get("env", "")} if reached is not None else set()
    return {*named, *parse_qs(visit.url.query).get("env", [])} - {""}


def asks_for_the_viewer(visit: Visit) -> bool:
    """A page or file of the viewer itself, which every login loads; anything under /api/ is a route of the journal's own."""
    return visit.handler.command == "GET" and not visit.url.path.startswith("/api/")


class MemberLogins:
    """The login page's pages and actions for the people the owner invites."""

    def below_login(self) -> str:
        return BELOW_LOGIN

    def pages(self, gateway: Gateway) -> dict[tuple[str, str], PageHandler]:
        return {("GET", "/join"): self.show_join, ("POST", "/join"): partial(self.join, gateway),
                ("GET", "/member"): self.show_login, ("POST", "/member"): partial(self.log_in, gateway)}

    def actions(self, gateway: Gateway) -> dict[tuple[str, str], Act]:
        return {("GET", "/api/hosting/me"): self.me, ("GET", "/api/hosting/members"): partial(self.listed, gateway),
                ("POST", "/api/hosting/leave"): partial(self.leave, gateway)}

    def owner_actions(self, gateway: Gateway) -> dict[tuple[str, str], PageHandler]:
        return {("POST", "/api/hosting/members"): self.invite,
                ("POST", "/api/hosting/members/role"): self.assign, ("POST", "/api/hosting/members/remove"): partial(self.remove, gateway),
                ("POST", "/api/hosting/members/end-logins"): partial(self.end_logins, gateway),
                ("POST", "/api/hosting/members/environments"): self.share}

    def refusal(self, visit: Visit, login: KeptLogin) -> str | None:
        member = Roster(visit.vault).present(login.member)
        if member is None:
            return NOT_A_MEMBER
        if not all(member.sees(environment) for environment in environments_named(visit)):
            return NOT_SHARED
        reached = visit.reached()
        if reached is None and asks_for_the_viewer(visit):
            return None
        if reached is not None and member.role.reaches(reached.target):
            return None
        return member.role.refusal()

    def marks(self, visit: Visit, login: KeptLogin) -> dict:
        """What the login page alone tells the journal of a member's request: who sent it, and the environments they may see."""
        member = Roster(visit.vault).present(login.member)
        if login.is_owners() or member is None:
            return {}
        return {MEMBER: member.id, SHARED: ",".join(member.environments)}

    def may_reach(self, record: Record, member: str, page: Page | Action) -> bool:
        """Whether this person may reach a page or action, from the browser or a phone alike."""
        if member == OWNER_ID:
            return True
        found = Roster(Vault(record.root)).present(member)
        return found is not None and found.sees(record.env) and found.role.reaches(page)

    def sees(self, record: Record, member: str, row: Resource) -> bool:
        """Whether this person may see a row, on their phone as in the viewer: only in, and of, the environments shared with them."""
        if member == OWNER_ID:
            return True
        found = Roster(Vault(record.root)).present(member)
        named = environment_of(row.type, as_dict(row))
        return found is not None and found.sees(record.env) and (named is None or found.sees(named))

    def show_join(self, visit: Visit) -> None:
        code = parse_qs(visit.url.query).get("code", [""])[0]
        member = Roster(visit.vault).invited_by(code)
        if member is None:
            return visit.page(404, notice_page(visit.project(), Notice.WRONG_INVITE.value))
        return visit.page(200, join_page(visit.project(), member.name, code, Notice.NONE))

    def join(self, gateway: Gateway, visit: Visit) -> None:
        if not visit.same_origin():
            return visit.refuse(403, "joining comes only from this journal's own page")
        form = visit.form()
        roster = Roster(visit.vault)
        if not form.chooses_password():
            invited = roster.invited_by(form.code)
            if invited is None:
                return visit.page(404, notice_page(visit.project(), Notice.WRONG_INVITE.value))
            return visit.page(400, join_page(visit.project(), invited.name, form.code, Notice.SHORT))

        def joined() -> str | None:
            member = roster.join(form.code, form.password)
            if member is None:
                return None
            visit.vault.audit("member joined", place=visit.place(), member=member.id)
            return member.id
        return gateway.tried(visit, joined, lambda: notice_page(visit.project(), Notice.WRONG_INVITE.value))

    def show_login(self, visit: Visit) -> None:
        return visit.page(200, member_login_page(visit.project(), Notice.NONE))

    def log_in(self, gateway: Gateway, visit: Visit) -> None:
        if not visit.same_origin():
            return visit.refuse(403, "a login comes only from this journal's own page")
        form = visit.form()
        roster = Roster(visit.vault)
        return gateway.tried(visit, lambda: roster.matching(form.name, form.password), lambda: member_login_page(visit.project(), Notice.WRONG_NAME))

    def me(self, visit: Visit, login: KeptLogin) -> None:
        if login.is_owners():
            return visit.json(200, asdict(Someone(OWNER_ID, OWNER_NAME, OWNER_ID, True, OWNER_ABILITIES)))
        member = Roster(visit.vault).present(login.member)
        if member is None:
            return visit.refuse(403, NOT_A_MEMBER)
        return visit.json(200, asdict(Someone(member.id, member.name, member.role, False, member.role.abilities())))

    def listed(self, gateway: Gateway, visit: Visit, login: KeptLogin) -> None:
        connected = gateway.connected(visit.vault.clock())
        members = [{**member.summary(), "connected": member.id in connected} for member in Roster(visit.vault).all()]
        return visit.json(200, {"owner": {"name": OWNER_NAME, "connected": OWNER_ID in connected}, "members": members})

    def invite(self, visit: Visit) -> None:
        asked = visit.asked(Invited)
        made = Roster(visit.vault).invite(asked.name, Role.named(asked.role), (runtime.env(visit.record.root),))
        visit.vault.audit("member invited", place=visit.place(), member=made.member.id)
        return visit.json(201, {"member": made.member.summary(), "link": f"{visit.origin()}/join?code={made.code}"})

    def assign(self, visit: Visit) -> None:
        asked = visit.asked(Assigned)
        member = Roster(visit.vault).assign(asked.member, Role.named(asked.role))
        visit.vault.audit("member role changed", place=visit.place(), member=member.id, role=member.role)
        return visit.json(200, {"member": member.summary()})

    def leave(self, gateway: Gateway, visit: Visit, login: KeptLogin) -> None:
        if login.is_owners():
            return visit.block("The owner cannot leave their own journal; they can take it down.")
        member = Roster(visit.vault).depart(login.member, Departure.LEFT)
        ended = gateway.end_logins_of(visit.vault, member.id)
        visit.vault.audit("member left", place=visit.place(), member=member.id, logins_ended=ended)
        return visit.json(200, {"member": member.summary(), "login": "/login?notice=left"}, {"Set-Cookie": visit.cookie(COOKIE, "", 0)})

    def remove(self, gateway: Gateway, visit: Visit) -> None:
        member = Roster(visit.vault).depart(visit.asked(Picked).member, Departure.REMOVED)
        ended = gateway.end_logins_of(visit.vault, member.id)
        visit.vault.audit("member removed", place=visit.place(), member=member.id, logins_ended=ended)
        return visit.json(200, {"member": member.summary()})

    def end_logins(self, gateway: Gateway, visit: Visit) -> None:
        member = Roster(visit.vault).required(visit.asked(Picked).member)
        ended = gateway.end_logins_of(visit.vault, member.id)
        visit.vault.audit("member's logins ended", place=visit.place(), member=member.id, logins_ended=ended)
        return visit.json(200, {"member": member.summary(), "ended": ended})

    def share(self, visit: Visit) -> None:
        asked = visit.asked(Shared)
        unknown = [environment for environment in asked.environments if not known_environment(visit.record.root, environment)]
        if unknown:
            return visit.refuse(400, f"there is no environment {', '.join(unknown)}")
        member = Roster(visit.vault).share(asked.member, asked.environments)
        visit.vault.audit("member's environments changed", place=visit.place(), member=member.id, environments=list(member.environments))
        return visit.json(200, {"member": member.summary()})
