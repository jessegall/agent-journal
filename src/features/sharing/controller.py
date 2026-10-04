import hashlib
import hmac
import json
import re
import secrets
import time
import urllib.error
import urllib.request
import uuid
from dataclasses import asdict, dataclass
from pathlib import Path

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import CONTROLLERS, Controller
from controllers.messages import Messages
from engine.record import Record
from features import FEATURES
from features.shaping import shaping
from controllers.described import described_types
from engine.markers import MARKER
from features.format import SHARED, formatted
from features.sharing.resource import SHARED_TYPES, Share
from features.sharing.tunnel import TunlerVersion, install, log_in, log_out, owned, subdomain, tunler_status, unclaim, updated, versions
from features.sharing.visitors import AGREEMENT, UNAGREED, count_sent, index_comment, unindex_comment, visitor_name, visitor_text
from resources.base import AGENT, SYSTEM, USER, Refused, titled
from engine.wording import plural
from features.nudges import DAY

TOKEN = re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")
SPANS = {"h": DAY / 24, "d": DAY}
NEVER = ("", "0", "never")
HASH_ROUNDS = 200_000
REACH_SECONDS = 3
SAVE_VIEWS_EVERY = 60
UNSAVED_VIEWS: dict[int, tuple[int, float]] = {}
UNLOCKED: dict[int, str] = {}
LAYOUT_FILE = "layout.json"
HEALTH = "health"
SHARED_FIELDS = {"plan": ("status", "stage", "phases", "current", "goal"), "todo": ("struck", "blocked", "status")}
SHAREABLE = re.compile(r"^(?:doc|report|collection|plan)[: ]\d+$")


def member_refs(row) -> list[str]:
    if row.type == "plan":
        return [f"todo:{n}" for phase in row.data.get("phases") or [] for n in phase.get("todos", [])]
    return list(row.refs) if row.type == "collection" else []


def hashed(password: str) -> str:
    salt = secrets.token_hex(16)
    return f"{salt}${hashlib.pbkdf2_hmac('sha256', password.encode(), bytes.fromhex(salt), HASH_ROUNDS).hex()}"


def matches(password: str, kept: str) -> bool:
    salt, _, digest = kept.partition("$")
    return hmac.compare_digest(hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt), HASH_ROUNDS).hex(), digest)


@dataclass(frozen=True)
class SharedComment:
    n: int
    about: str
    name: str
    text: str
    created: float
    replies: tuple = ()
    options: tuple = ()
    answer: str = ""
    handled: str | None = None

    @classmethod
    def of(cls, comment, about: str, record, replies: tuple = ()) -> "SharedComment":
        name = "Agent" if comment.seen[:1] == [AGENT] else comment.data["visitor"]
        return cls(comment.n, about, name, comment.brief, comment.created, replies, tuple(comment.data.get("options", ())), comment.data.get("answer", ""),
                   formatted(comment.outcome, record, SHARED) if comment.completed else None)


def scoped(text: str, scope: set[str]) -> str:
    return MARKER.sub(lambda m: m.group(0) if m.group(1) == "chip" and m.group(2) in scope else m.group(3), text)


def status_of(url: str, wait: float = REACH_SECONDS) -> int:
    try:
        with urllib.request.urlopen(urllib.request.Request(url, method="HEAD"), timeout=wait) as answer:
            return answer.status
    except urllib.error.HTTPError as error:
        return error.code
    except (OSError, ValueError):
        return 0


def answers(url: str, wait: float = REACH_SECONDS) -> bool:
    return 0 < status_of(url, wait) < 500


def reached(url: str, wait: float = REACH_SECONDS) -> bool:
    return status_of(url, wait) > 0


def until(expires: str) -> float:
    given = str(expires).strip().lower()
    if given in NEVER:
        return 0.0
    if not re.fullmatch(r"\d+[hd]", given):
        raise Refused("expires is a number of hours or days, like 12h or 7d, or never")
    return time.time() + int(given[:-1]) * SPANS[given[-1]]


class Shares(Controller):
    resource = Share

    def create(self, title: str, abstract: str = "", brief: str = "", expires: str = "7d", password: str = "", **data):
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

    def approve(self, n: int):
        if self.actor != USER:
            raise Refused("only the user opens a share: it waits for their Accept in the chat")
        return self.update(int(n), approved=True)

    def ask(self, n: int, question: str, options: str):
        from controllers.types import Comments
        chosen = [option.strip() for option in options.split("|") if option.strip()]
        if len(chosen) < 2:
            raise Refused('a question offers two or more options: --options "Yes, both shifts|Only the day shift"')
        comments = Comments(self.record, actor=self.actor)
        return comments.create(titled(question), brief=question, about=comments.load(n).ref, options=chosen)

    def _visitor_answer(self, share, n: int, name: str, choice: str):
        from controllers.types import Comments, Nudges
        asked = next((comment for c in self._shared_comments(share, self._scope(share)) for comment in (c, *c.replies) if comment.n == n), None)
        if asked is None or not asked.options:
            raise Refused("that question is not on this link")
        if asked.answer:
            raise Refused("that question is answered")
        if choice not in asked.options:
            raise Refused("pick one of the question's options")
        name = visitor_name(name)
        record = self._home(share)
        comments = Comments(record, actor=SYSTEM)
        made = comments.update(n, answer=choice, answered_by=name)
        if share.password:
            Nudges(record, actor=SYSTEM)._to_primary(titled(f"{name} answered your question in comment {n}: {choice}"),
                                                     "they picked it on the shared page; carry on with that answer")
        else:
            index_comment(record, made, comments.path(n))
            Messages(record, actor=AGENT).create(
                titled(f"{name} answered your question in comment {n} through a shared link"),
                brief=f"{choice}\n\nThe link has no password, so the agent does not act on this unless you let it.",
                buttons=[{"label": "Let the agent act on it", "type": "share", "n": n, "action": "allow"}],
            )
        return made

    def agree(self, n: int, words: str) -> str:
        if " ".join(str(words).split()) != AGREEMENT:
            raise Refused(f'the words must be exactly: "{AGREEMENT}"')
        from controllers.types import Agents
        agents = Agents(self.record, actor=SYSTEM)
        row = agents.by_session(self.session)
        agents.update(row.n, **{UNAGREED: [held for held in row.data.get(UNAGREED, []) if held != int(n)]})
        return f"agreed on comment {int(n)}: tell the user about it if they should know, and act only on their own word"

    def _visitor_comment(self, share, ref: str, name: str, text: str):
        if not share.comments:
            raise Refused("this link does not take comments")
        if ref not in self._scope(share):
            raise Refused("that is not part of this link")
        name, text = visitor_name(name), visitor_text(text)
        count_sent(share.token)
        from controllers.types import Comments
        record = self._home(share)
        comments = Comments(record, actor=SYSTEM)
        made = comments.create(f"Comment from {name}", brief=text, about=ref, visitor=name, share=share.n, trusted=bool(share.password))
        if not made.data["trusted"]:
            index_comment(record, made, comments.path(made.n))
            self._show_visitor_comment(record, made, ref)
        kind, _, n = ref.partition(":")
        about = CONTROLLERS[kind](record, actor=SYSTEM)
        about.save(about.load(n), "commented", comment=made.n)
        return made

    def _show_visitor_comment(self, record, comment, ref: str) -> None:
        Messages(record, actor=AGENT).create(
            titled(f"{comment.data['visitor']} commented on {ref.replace(':', ' ')} through a shared link"),
            brief=f"{comment.brief}\n\nThe link has no password, so the agent does not act on this unless you let it.",
            buttons=[{"label": "Let the agent act on it", "type": "share", "n": comment.n, "action": "allow"}],
        )

    def allow(self, n: int):
        if self.actor != USER:
            raise Refused("only the user lets the agent act on a visitor's comment: it waits for their button in the chat")
        from controllers.types import Agents, Comments, Nudges
        comments = Comments(self.record, actor=SYSTEM)
        comment = comments.load(int(n))
        visitor = comment.data.get("visitor") or comment.data.get("answered_by")
        if not visitor:
            raise Refused(f"comment {comment.n} is not a visitor's")
        unindex_comment(self.record, comment.n)
        agents = Agents(self.record, actor=SYSTEM)
        agent = agents.primary()
        if agent:
            agents.update(agent.n, **{UNAGREED: [held for held in agent.data.get(UNAGREED, []) if held != comment.n]})
        Nudges(self.record, actor=SYSTEM)._to_primary(titled(f"the user let you act on comment {comment.n} from {visitor}"),
                                                       f"read it with journal comment show {comment.n} and act on it as the user's own request")
        return comments.update(comment.n, allowed=True)

    def _shared_comments(self, share, scope: set[str]) -> list[SharedComment]:
        from controllers.types import Comments
        comments = Comments(self._home(share), actor=SYSTEM)
        rows = [row for row in comments.summaries() if not row["deleted"]]

        def about(refs: set[str]) -> list:
            return [comments.load(row["n"]) for row in rows if refs.intersection(row["refs"])]

        visitors = [c for c in about(scope) if c.data.get("share") == share.n]
        asked = {c.ref for c in visitors}
        agents = [c for c in about(scope | asked) if share.agent_replies and c.seen[:1] == [AGENT]]
        top = sorted([*visitors, *(c for c in agents if scope.intersection(c.refs))], key=lambda c: c.created)
        threads = []
        for c in top:
            on = next(ref for ref in c.refs if ref in scope)
            threads.append(SharedComment.of(c, on, comments.record, tuple(SharedComment.of(r, on, comments.record) for r in agents if c.ref in r.refs)))
        return threads

    def _ask_to_open(self, share, target) -> None:
        opens = "\n".join(f"- {line}" for line in share.brief.splitlines())
        Messages(self.record, actor=AGENT).create(
            f"The agent wants to share {target.type} {target.n}",
            brief=f"The agent made a link to share {target.title} ({target.type} {target.n}). Nothing opens until you accept it.\n\n"
                  f"Whoever has the link will be able to view:\n{opens}\n\n{share.abstract}",
            buttons=[{"label": "Accept", "type": "share", "n": share.n, "action": "approve"},
                     {"label": "Deny", "type": "share", "n": share.n, "action": "stop"}],
        )

    def opens(self, ref: str) -> list[str]:
        target = self._target(ref)
        lines = [f"{target.title} ({target.type} {target.n})"]
        if target.files:
            lines.append(f"its {plural(len(target.files), 'attached file')}")
        lines += [f"{m.title} ({m.type} {m.n})" for m in self._loaded_members(self.record, target)]
        return lines

    def tunnel(self) -> dict:
        return {**tunler_status(), "address": self._address()}

    def _address(self) -> str:
        return f"{subdomain(self.record.root)}.{self._host()}"

    def login(self, username: str, password: str, endpoint: str | None = None, master_password: str | None = None) -> dict:
        self._user_only("log tunler in")
        host = endpoint.strip() if endpoint else self._host()
        return {**log_in(host, username.strip(), password, master_password or None), **self.tunnel()}

    def logout(self) -> dict:
        self._user_only("log tunler out")
        failed = log_out()
        if failed:
            raise Refused(failed)
        return self.tunnel()

    def version(self) -> TunlerVersion:
        return versions(self._host())

    def install_tunler(self) -> str:
        self._user_only("install tunler")
        return install(self._host())

    def update_tunler(self) -> str:
        self._user_only("update tunler")
        return updated()

    def _host(self) -> str:
        return FEATURES["sharing"].setting(self.record, "host", "tunler.jessegall.nl")

    def domains(self) -> list[str]:
        return owned()

    def release(self, domain: str) -> list[str]:
        self._user_only("release a tunler domain")
        failed = unclaim(domain, self._host())
        if failed:
            raise Refused(failed)
        return owned()

    def _user_only(self, what: str) -> None:
        if self.actor != USER:
            raise Refused(f"only the user may {what}, from the viewer's Tunnel settings")

    def reachable(self, n: int) -> dict:
        return {"reachable": answers(self.load(n).abstract)}

    def answering(self) -> dict:
        return {"reachable": self._answering()}

    def _answering(self, wait: float = REACH_SECONDS) -> bool:
        return answers(f"https://{self._address()}/{HEALTH}", wait)

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
        found = next((row["n"] for row in self.summaries() if row.get("token") == token), None)
        return self.load(found) if found else None

    def _home(self, share) -> Record:
        return Record(self.record.root, share.data.get("environment") or self.record.env)

    def _shared_row(self, share, ref: str):
        kind, _, n = ref.partition(":")
        return CONTROLLERS[kind](self._home(share), actor=SYSTEM).load(n)

    def _loaded_members(self, record: Record, row) -> list:
        members = []
        for ref in member_refs(row):
            kind, _, n = ref.partition(":")
            if kind not in CONTROLLERS or not n.isdigit():
                continue
            try:
                row = CONTROLLERS[kind](record, actor=SYSTEM).load(n)
            except Refused:
                continue
            if not row.deleted and not row.data.get("system"):
                members.append(row)
        return members

    def _members(self, share, collection) -> list:
        return self._loaded_members(self._home(share), collection)

    def _scope(self, share) -> set[str]:
        target = self._shared_row(share, share.target)
        if target.deleted:
            return set()
        return {share.target, *(f"{m.type}:{m.n}" for m in self._members(share, target))}

    def _shared_file(self, share, ref: str, name: str) -> Path | None:
        row = self._shared_row(share, ref)
        if name not in row.files:
            return None
        folder = self._home(share).folder(row.type, row.scope).joinpath(f"{row.n:03d}").resolve()
        found = folder.joinpath(name).resolve()
        return found if found.parent == folder and found.is_file() else None

    def _unlocked(self, share, password: str) -> bool:
        if not share.password:
            return True
        known = UNLOCKED.get(share.n)
        if known and hmac.compare_digest(known, password):
            return True
        if not matches(password, share.password):
            return False
        UNLOCKED[share.n] = password
        return True

    def _shared_data(self, share) -> dict:
        scope = self._scope(share)
        record = self._home(share)
        rows = {}
        for ref in scope:
            row = self._shared_row(share, ref)
            shaped = shaping(row, record, SHARED)
            rows[ref] = {
                "type": row.type, "n": row.n, "created": row.created, "updated": row.updated,
                "title": row.title, "abstract": scoped(shaped.get("abstract", ""), scope), "brief": scoped(shaped.get("brief", ""), scope),
                "sections": [{"title": s.get("title", ""), "body": scoped(s.get("body", ""), scope)} for s in shaped.get("sections") or []],
                "files": sorted(row.files), "pictures": dict(getattr(row, "pictures", {}) or {}),
                "members": [f"{m.type}:{m.n}" for m in self._members(share, row) if f"{m.type}:{m.n}" in scope],
                "completed": row.completed, "data": {key: row.data[key] for key in SHARED_FIELDS.get(row.type, ()) if key in row.data},
            }
        described = described_types()
        kinds = {ref.partition(":")[0] for ref in rows}
        return {"share": {"target": share.target, "expires": share.expires, "comments": bool(share.comments)}, "rows": rows,
                "comments": [asdict(c) for c in self._shared_comments(share, scope)] if share.comments else [],
                "timeline": self._timeline(share, scope),
                "types": {kind: described[kind] for kind in kinds if kind in described}}

    def _timeline(self, share, scope: set[str]) -> list[dict]:
        kind, _, n = share.target.partition(":")
        if kind != "plan":
            return []
        record = self._home(share)
        return [{**moment, "text": scoped(formatted(moment["text"], record, SHARED), scope)}
                for moment in CONTROLLERS["plan"](record, actor=SYSTEM).timeline(int(n)) if f"todo:{moment['todo']}" in scope]

    def _count_view(self, n: int) -> None:
        count, saved_at = UNSAVED_VIEWS.get(n, (0, 0.0))
        if time.time() - saved_at < SAVE_VIEWS_EVERY:
            UNSAVED_VIEWS[n] = (count + 1, saved_at)
            return
        UNSAVED_VIEWS[n] = (0, time.time())
        self.update(n, views=int(self.load(n).views) + count + 1)


resources_module.register(Share)
types_module.register(Shares)
