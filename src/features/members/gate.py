from dataclasses import asdict, dataclass
from functools import partial
from urllib.parse import parse_qs

from engine.fields import Loaded
from features.hosted_journal.gateway import Gateway, Visit
from features.hosted_journal.owner import OWNER, KeptLogin
from features.hosted_journal.pages import Notice, notice_page
from features.hosted_journal.people import Act, Page
from features.members.pages import BELOW_LOGIN, join_page, member_login_page
from features.members.roster import Roster

OWNER_NAME = "Owner"


@dataclass(frozen=True)
class Invited(Loaded):
    name: str = ""


@dataclass(frozen=True)
class Someone:
    """Who a login belongs to, as the viewer shows it."""

    member: str
    name: str
    owner: bool


class MemberLogins:
    """The login page's pages and actions for the people the owner invites."""

    def below_login(self) -> str:
        return BELOW_LOGIN

    def pages(self, gateway: Gateway) -> dict[tuple[str, str], Page]:
        return {("GET", "/join"): self.show_join, ("POST", "/join"): partial(self.join, gateway),
                ("GET", "/member"): self.show_login, ("POST", "/member"): partial(self.log_in, gateway)}

    def actions(self, gateway: Gateway) -> dict[tuple[str, str], Act]:
        return {("GET", "/api/hosting/me"): self.me}

    def owner_actions(self, gateway: Gateway) -> dict[tuple[str, str], Page]:
        return {("GET", "/api/hosting/members"): self.listed, ("POST", "/api/hosting/members"): self.invite}

    def refusal(self, visit: Visit, login: KeptLogin) -> str | None:
        if Roster(visit.vault).found(login.member) is None:
            return "you are no longer a member of this journal"
        if visit.handler.command != "GET":
            return "a member reads this journal and changes nothing in it"
        return None

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
            return visit.json(200, asdict(Someone(OWNER, OWNER_NAME, True)))
        member = Roster(visit.vault).found(login.member)
        if member is None:
            return visit.refuse(403, "you are no longer a member of this journal")
        return visit.json(200, asdict(Someone(member.id, member.name, False)))

    def listed(self, visit: Visit) -> None:
        return visit.json(200, {"members": [member.summary() for member in Roster(visit.vault).all()]})

    def invite(self, visit: Visit) -> None:
        made = Roster(visit.vault).invite(visit.asked(Invited).name)
        visit.vault.audit("member invited", place=visit.place(), member=made.member.id)
        return visit.json(201, {"member": made.member.summary(), "link": f"{visit.origin()}/join?code={made.code}"})
