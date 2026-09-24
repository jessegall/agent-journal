import re
import time
import uuid
from pathlib import Path

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import CONTROLLERS, Controller
from engine.record import Record
from features import FEATURES
from features.sharing.resource import SHARED_TYPES, Share
from features.sharing.tunnel import subdomain
from resources.base import SYSTEM, Refused

TOKEN = re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")
SPANS = {"h": 3600, "d": 86400}
NEVER = ("", "0", "never")
SHAREABLE = re.compile(r"^(?:doc|collection)[: ]\d+$")


def until(expires: str) -> float:
    given = str(expires).strip().lower()
    if given in NEVER:
        return 0.0
    if not re.fullmatch(r"\d+[hd]", given):
        raise Refused("expires is a number of hours or days, like 12h or 7d, or never")
    return time.time() + int(given[:-1]) * SPANS[given[-1]]


class Shares(Controller):
    resource = Share

    def create(self, title: str, abstract: str = "", brief: str = "", expires: str = "7d", **data):
        if not SHAREABLE.match(title.strip()):
            return super().create(title, abstract, brief, **data)
        target = self._target(title)
        token = str(uuid.uuid4())
        return super().create(f"Share of {target.type} {target.n}", abstract=self._link(token), brief="\n".join(self.opens(title)),
                              target=f"{target.type}:{target.n}", token=token, expires=until(expires), **data)

    def opens(self, ref: str) -> list[str]:
        target = self._target(ref)
        lines = [f"{target.title} ({target.type} {target.n})"]
        if target.files:
            lines.append(f"its {len(target.files)} attached {'file' if len(target.files) == 1 else 'files'}")
        if target.type == "collection":
            lines += [f"{m.title} ({m.type} {m.n})" for m in self._loaded_members(self.record, target)]
        return lines

    def _link(self, token: str) -> str:
        host = FEATURES["sharing"].setting(self.record, "host", "tunler.jessegall.nl")
        return f"https://{subdomain(self.record.root)}.{host}/s/{token}"

    def _target(self, ref: str):
        kind, _, number = str(ref).strip().replace(" ", ":", 1).partition(":")
        if kind not in SHARED_TYPES or not number.isdigit():
            raise Refused(f"only a document or a collection can be shared: write it as doc:12 or collection:3, not {ref!r}")
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

    def _loaded_members(self, record: Record, collection) -> list:
        members = []
        for ref in collection.refs:
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
        members = self._members(share, target) if target.type == "collection" else []
        return {share.target, *(f"{m.type}:{m.n}" for m in members)}

    def _shared_file(self, share, ref: str, name: str) -> Path | None:
        row = self._shared_row(share, ref)
        if name not in row.files:
            return None
        folder = self._home(share).folder(row.type, row.scope).joinpath(f"{row.n:03d}").resolve()
        found = folder.joinpath(name).resolve()
        return found if found.parent == folder and found.is_file() else None

    def _count_view(self, n: int) -> None:
        share = self.load(n)
        self.update(n, views=int(share.views or 0) + 1)


resources_module.register(Share)
types_module.register(Shares)
