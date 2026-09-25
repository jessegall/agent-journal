import hashlib
import hmac
import json
import re
import secrets
import time
import urllib.error
import urllib.request
import uuid
from pathlib import Path

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import CONTROLLERS, Controller
from engine.record import Record
from features import FEATURES
from commands.dispatch import shaping
from engine.manifest import manifest
from engine.markers import MARKER
from features.format import VIEWER, formatted
from features.sharing.resource import SHARED_TYPES, Share
from features.sharing.tunnel import log_in, subdomain, tunler_status
from features.sharing.visitors import AGREEMENT, UNAGREED, count_sent, index_comment, visitor_name, visitor_text
from resources.base import AGENT, SYSTEM, USER, Refused

TOKEN = re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")
SPANS = {"h": 3600, "d": 86400}
NEVER = ("", "0", "never")
HASH_ROUNDS = 200_000
REACH_SECONDS = 3
SAVE_VIEWS_EVERY = 60
UNSAVED_VIEWS: dict[int, tuple[int, float]] = {}
UNLOCKED: dict[int, str] = {}
LAYOUT_FILE = "layout.json"
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


def scoped(text: str, scope: set[str]) -> str:
    return MARKER.sub(lambda m: m.group(0) if m.group(1) == "chip" and m.group(2) in scope else m.group(3), text or "")


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
        made = comments.create(f"Comment from {name}", brief=text, about=ref, visitor=name, share=share.n)
        index_comment(record, made, comments.path(made.n))
        kind, _, n = ref.partition(":")
        about = CONTROLLERS[kind](record, actor=SYSTEM)
        about.save(about.load(int(n)), "commented", comment=made.n)
        return made

    def _visitor_comments(self, share, scope: set[str]) -> list[dict]:
        from controllers.types import Comments
        comments = Comments(self._home(share), actor=SYSTEM)
        made = [comments.load(row["n"]) for row in comments.summaries() if not row["deleted"] and scope.intersection(row["refs"])]
        return [{"n": c.n, "about": next(ref for ref in c.refs if ref in scope), "name": c.data["visitor"], "text": c.brief, "created": c.created}
                for c in made if c.data.get("share") == share.n]

    def _ask_to_open(self, share, target) -> None:
        opens = "\n".join(f"- {line}" for line in share.brief.splitlines())
        CONTROLLERS["message"](self.record, actor=AGENT).create(
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
            lines.append(f"its {len(target.files)} attached {'file' if len(target.files) == 1 else 'files'}")
        lines += [f"{m.title} ({m.type} {m.n})" for m in self._loaded_members(self.record, target)]
        return lines

    def tunnel(self) -> dict:
        host = FEATURES["sharing"].setting(self.record, "host", "tunler.jessegall.nl")
        return {**tunler_status(), "address": f"{subdomain(self.record.root)}.{host}"}

    def login(self, email: str, password: str) -> dict:
        failed = log_in(FEATURES["sharing"].setting(self.record, "host", "tunler.jessegall.nl"), email.strip(), password)
        if failed:
            raise Refused(failed)
        return self.tunnel()

    def reachable(self, n: int) -> dict:
        share = self.load(int(n))
        try:
            with urllib.request.urlopen(urllib.request.Request(share.abstract, method="HEAD"), timeout=REACH_SECONDS) as answer:
                return {"reachable": answer.status < 500}
        except urllib.error.HTTPError as error:
            return {"reachable": error.code < 500}
        except (OSError, ValueError):
            return {"reachable": False}

    def _link(self, token: str) -> str:
        host = FEATURES["sharing"].setting(self.record, "host", "tunler.jessegall.nl")
        return f"https://{subdomain(self.record.root)}.{host}/s/{token}"

    def _target(self, ref: str):
        kind, _, number = str(ref).strip().replace(" ", ":", 1).partition(":")
        if kind not in SHARED_TYPES or not number.isdigit():
            raise Refused(f"only a document, a report, a collection or a plan can be shared: write it as doc:12, report:4, collection:3 or plan:2, not {ref!r}")
        row = CONTROLLERS[kind](self.record, actor=SYSTEM).load(int(number))
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
        return CONTROLLERS[kind](self._home(share), actor=SYSTEM).load(int(n))

    def _loaded_members(self, record: Record, row) -> list:
        members = []
        for ref in member_refs(row):
            kind, _, n = ref.partition(":")
            if kind not in CONTROLLERS or not n.isdigit():
                continue
            try:
                row = CONTROLLERS[kind](record, actor=SYSTEM).load(int(n))
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
            shaped = shaping(row, record, VIEWER)
            rows[ref] = {
                "type": row.type, "n": row.n, "created": row.created, "updated": row.updated,
                "title": row.title, "abstract": scoped(shaped.get("abstract", ""), scope), "brief": scoped(shaped.get("brief", ""), scope),
                "sections": [{"title": s.get("title", ""), "body": scoped(s.get("body", ""), scope)} for s in shaped.get("sections") or []],
                "files": sorted(row.files), "pictures": dict(getattr(row, "pictures", {}) or {}),
                "members": [f"{m.type}:{m.n}" for m in self._members(share, row) if f"{m.type}:{m.n}" in scope],
                "completed": row.completed, "data": {key: row.data[key] for key in SHARED_FIELDS.get(row.type, ()) if key in row.data},
            }
        described = manifest()["types"]
        kinds = {ref.partition(":")[0] for ref in rows}
        return {"share": {"target": share.target, "expires": share.expires, "comments": bool(share.comments)}, "rows": rows,
                "comments": self._visitor_comments(share, scope) if share.comments else [],
                "timeline": self._timeline(share, scope),
                "types": {kind: described[kind] for kind in kinds if kind in described}}

    def _timeline(self, share, scope: set[str]) -> list[dict]:
        kind, _, n = share.target.partition(":")
        if kind != "plan":
            return []
        record = self._home(share)
        return [{**moment, "text": scoped(formatted(moment["text"], record, VIEWER), scope)}
                for moment in CONTROLLERS["plan"](record, actor=SYSTEM).timeline(int(n)) if f"todo:{moment['todo']}" in scope]

    def _count_view(self, n: int) -> None:
        count, saved_at = UNSAVED_VIEWS.get(n, (0, 0.0))
        if time.time() - saved_at < SAVE_VIEWS_EVERY:
            UNSAVED_VIEWS[n] = (count + 1, saved_at)
            return
        UNSAVED_VIEWS[n] = (0, time.time())
        self.update(n, views=int(self.load(n).views or 0) + count + 1)


resources_module.register(Share)
types_module.register(Shares)
