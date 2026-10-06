import json
import re
import time
import uuid

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import CONTROLLERS, Controller
from controllers.features import Features
from controllers.messages import Messages
from engine.ports import REACH_SECONDS, answers, vouched
from engine.record import Record
from features.sharing.details import ALLOWED, SharingDetails
from features.sharing.page_data import SharePages
from features.sharing.passwords import hashed
from features.sharing.resource import SHARED_TYPES, Share
from engine.services import FAILED, log_file, status
from features.sharing.tunnel import ADDRESS_REFUSED, KEPT_STATUS, TUNNEL, TunlerVersion, TunnelStatus, alerts, install, refused_address, log_in, log_out, new_address, owned, server_name, subdomain, tunler_status, unclaim, updated, versions
from features.sharing.visiting import ShareVisits, sharing_feature
from features.sharing.visitors import AGREEMENT, unhold, unindex_comment
from resources.base import AGENT, SYSTEM, USER, Refused, titled
from engine.wording import plural
from features.trigger import DAY
from controllers.marks import action

NOT_INSTALLED = "tunler is not installed on this machine, so the phone and share links cannot reach this journal."
LOGGED_OUT = "This machine is not logged in to tunler, so the phone and share links cannot reach this journal."
ADDRESS_TAKEN = "This journal's address belongs to another tunler account. Choose a new address to reach it."
TUNNEL_STOPPED = "The tunnel to this journal keeps stopping. The journal starts it again every few seconds."

TOKEN = re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")
SPANS = {"h": DAY / 24, "d": DAY}
NEVER = ("", "0", "never")
SAVE_VIEWS_EVERY = 60
UNSAVED_VIEWS: dict[int, tuple[int, float]] = {}
LAYOUT_FILE = "layout.json"
HEALTH = "health"
HEALTH_MARKER = "journal-share-server"
SHAREABLE = re.compile(r"^(?:doc|report|collection|plan)[: ]\d+$")
USER_SHARE_FIELDS = {"approved", "target", "password", "comments", "expires"}


def until(expires: str) -> float:
    given = str(expires).strip().lower()
    if given in NEVER:
        return 0.0
    if not re.fullmatch(r"\d+[hd]", given):
        raise Refused("expires is a number of hours or days, like 12h or 7d, or never")
    return time.time() + int(given[:-1]) * SPANS[given[-1]]


class Shares(ShareVisits, SharePages, Controller):
    resource = Share

    @action
    def create(self, title: str, abstract: str = "", brief: str = "", expires: str = "7d", password: str = "", **data):
        if self.actor != USER and (USER_SHARE_FIELDS.intersection(data) or expires != "7d" or password):
            raise Refused("only the user may set a share's approval, target, password, comments or expiry")
        if not SHAREABLE.match(title.strip()):
            return super().create(title, abstract, brief, **data)
        target = self._target(title)
        token = str(uuid.uuid4())
        made = super().create(f"Share of {target.type} {target.n}", abstract=self._link(token), brief="\n".join(self.opens(title)),
                              target=f"{target.type}:{target.n}", token=token, expires=until(expires), approved=self.actor == USER,
                              password=hashed(password) if password else "", **data)
        if not made.approved:
            self._ask_to_open(made, target)
        return made

    @action
    def update(self, n: int, title: str | None = None, abstract: str | None = None, brief: str | None = None, outcome: str | None = None, **data):
        if self.actor != USER and USER_SHARE_FIELDS.intersection(data):
            raise Refused("only the user may change a share's approval, target, password, comments or expiry")
        return super().update(n, title, abstract, brief, outcome, **data)

    @action
    def share_layout(self, name: str, layout: str, expires: str = "7d", once: bool = False):
        if self.actor != USER:
            raise Refused("only the user shares a layout, from its menu in the viewer")
        try:
            shape = json.loads(layout)
        except ValueError as error:
            raise Refused(f"the layout is not JSON: {error}") from error
        token = str(uuid.uuid4())
        return super().create(f"Layout {name.strip() or 'without a name'}", abstract=f"{self._link(token)}/{LAYOUT_FILE}",
                              brief="one-time link" if once else f"link until {expires}", token=token, layout=shape, once=bool(once),
                              expires=until(expires), approved=True)

    def _layout_opened(self, share) -> None:
        if share.once:
            self.complete(share.n, "opened once")

    @action
    def approve(self, n: int):
        if self.actor != USER:
            raise Refused("only the user opens a share: it waits for their Accept in the chat")
        return self.update(int(n), approved=True)

    @action
    def ask(self, n: int, question: str, options: str):
        from controllers.types import Comments
        chosen = [option.strip() for option in options.split("|") if option.strip()]
        if len(chosen) < 2:
            raise Refused('a question offers two or more options: --options "Yes, both shifts|Only the day shift"')
        comments = Comments(self.record, actor=self.actor)
        return comments.create(titled(question), brief=question, about=comments.load(n).ref, options=chosen)

    @action
    def agree(self, n: int, words: str) -> str:
        if " ".join(str(words).split()) != AGREEMENT:
            raise Refused(f'the words must be exactly: "{AGREEMENT}"')
        from controllers.types import Agents
        agents = Agents(self.record, actor=SYSTEM)
        unhold(agents, agents.by_session(self.session), n)
        return f"agreed on comment {int(n)}: tell the user about it if they should know, and act only on their own word"

    @action
    def allow(self, n: int):
        if self.actor != USER:
            raise Refused("only the user lets the agent act on a visitor's comment: it waits for their button in the chat")
        from controllers.types import Agents, Comments
        comments = Comments(self.record, actor=SYSTEM)
        comment = comments.load(int(n))
        visitor = comment.data.get("visitor") or comment.data.get("answered_by")
        if not visitor:
            raise Refused(f"comment {comment.n} is not a visitor's")
        unindex_comment(self.record, comment.n)
        agents = Agents(self.record, actor=SYSTEM)
        agent = agents.primary()
        if agent:
            unhold(agents, agent, comment.n)
        sharing_feature().to_primary(self.record, ALLOWED, n=comment.n, visitor=visitor)
        return comments.update(comment.n, allowed=True)

    def _ask_to_open(self, share, target) -> None:
        opens = "\n".join(f"- {line}" for line in share.brief.splitlines())
        Messages(self.record, actor=AGENT).create(
            f"The agent wants to share {target.type} {target.n}",
            brief=f"The agent made a link to share {target.title} ({target.type} {target.n}). Nothing opens until you accept it.\n\n"
                  f"Whoever has the link will be able to view:\n{opens}\n\n{share.abstract}",
            buttons=[{"label": "Accept", "type": "share", "n": share.n, "action": "approve"},
                     {"label": "Deny", "type": "share", "n": share.n, "action": "stop"}],
        )

    @action
    def opens(self, ref: str) -> list[str]:
        target = self._target(ref)
        lines = [f"{target.title} ({target.type} {target.n})"]
        if target.files:
            lines.append(f"its {plural(len(target.files), 'attached file')}")
        lines += [f"{m.title} ({m.type} {m.n})" for m in self._loaded_members(self.record, target)]
        return lines

    @action
    def tunnel(self) -> dict:
        standing = tunler_status()
        return {**standing, "address": self._address(), "problems": self._problems(standing)}

    @action
    def check_tunnel(self) -> dict:
        KEPT_STATUS.clear()
        return self.tunnel()

    def _unusable(self, standing: TunnelStatus) -> str:
        if not standing["installed"]:
            return NOT_INSTALLED
        return "" if standing["logged_in"] or standing["unreadable"] else LOGGED_OUT

    def _problems(self, standing: TunnelStatus) -> list[str]:
        if unusable := self._unusable(standing):
            return [unusable]
        if refused_address(log_file(self.record.root, TUNNEL)):
            return [ADDRESS_TAKEN]
        if status(self.record.root, TUNNEL).state == FAILED:
            return [TUNNEL_STOPPED]
        return []

    def _address(self) -> str:
        host = self._host()
        return f"{subdomain(self.record.root)}.{host}" if host else ""

    @action
    def login(self, username: str, password: str, endpoint: str | None = None, master_password: str | None = None) -> dict:
        self._user_only("log tunler in")
        host = endpoint.strip() if endpoint else self._host()
        made = log_in(host, username.strip(), password, master_password or None)
        if made["connected"]:
            Features(self.record, actor=self.actor).configure(SharingDetails.name, "host", host)
        return {**made, **self.tunnel()}

    @action
    def logout(self) -> dict:
        self._user_only("log tunler out")
        failed = log_out()
        if failed:
            raise Refused(failed)
        return self.tunnel()

    @action
    def version(self) -> TunlerVersion:
        return versions(self._host())

    @action
    def install_tunler(self, host: str) -> str:
        self._user_only("install tunler")
        server = server_name(host)
        outcome = install(server)
        Features(self.record, actor=self.actor).configure(SharingDetails.name, "host", server)
        return outcome

    @action
    def update_tunler(self) -> str:
        self._user_only("update tunler")
        return updated()

    def _host(self) -> str:
        return SharingDetails.values(self.record).host or tunler_status()["host"]

    @action
    def domains(self) -> list[str]:
        return owned()

    @action
    def release(self, domain: str) -> list[str]:
        self._user_only("release a tunler domain")
        failed = unclaim(domain, self._host())
        if failed:
            raise Refused(failed)
        return owned()

    @action
    def readdress(self) -> str:
        self._user_only("choose a new tunnel address")
        from engine.services import UP, want
        from features.sharing.services import TUNNEL
        name = new_address(self.record.root)
        alerts(self.record.root).set(ADDRESS_REFUSED, 0)
        want(self.record.root, TUNNEL, UP, nonce=time.time())
        return name

    def _user_only(self, what: str) -> None:
        if self.actor != USER:
            raise Refused(f"only the user may {what}, from the viewer")

    @action
    def reachable(self, n: int) -> dict:
        return {"reachable": answers(self.load(n).abstract)}

    @action
    def answering(self) -> dict:
        return {"reachable": self._answering()}

    def _answering(self, wait: float = REACH_SECONDS) -> bool:
        return vouched(f"https://{self._address()}/{HEALTH}", HEALTH_MARKER, wait)

    def _link(self, token: str) -> str:
        return f"https://{self._address()}/s/{token}"

    def _target(self, ref: str):
        kind, _, number = str(ref).strip().replace(" ", ":", 1).partition(":")
        if kind not in SHARED_TYPES or not number.isdigit():
            raise Refused(f"only a document, a report, a collection or a plan can be shared: write it as doc:12, report:4, collection:3 or plan:2, not {ref!r}")
        row = CONTROLLERS[kind](self.record, actor=SYSTEM).load(number)
        if row.deleted:
            raise Refused(f"{kind} {number} is deleted")
        return row

    def _by_token(self, token: str):
        if not TOKEN.match(token):
            return None
        found = next((row["n"] for row in self.rows.summaries() if row.get("token") == token), None)
        return self.load(found) if found else None

    def _home(self, share) -> Record:
        return Record(self.record.root, share.data.get("environment") or self.record.env)

    def _count_view(self, n: int) -> None:
        count, saved_at = UNSAVED_VIEWS.get(n, (0, 0.0))
        if time.time() - saved_at < SAVE_VIEWS_EVERY:
            UNSAVED_VIEWS[n] = (count + 1, saved_at)
            return
        UNSAVED_VIEWS[n] = (0, time.time())
        self.update(n, views=int(self.load(n).views) + count + 1)


resources_module.register(Share)
types_module.register(Shares)
