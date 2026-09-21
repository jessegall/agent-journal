import fcntl
import json
import time
import urllib.error
import urllib.request
from pathlib import Path

from controllers.types import Plugins
from engine.bus import ANY
from engine.hooks import default_env
from engine.record import Record
from features.plugins.answer import apply
from features.plugins.manifest import fill
from features.plugins.payload import of
from features.plugins.queue import drain
from features.plugins.run import SECONDS, call
from features.plugins.source import environment, folder, log
from resources.base import PLUGIN, Refused, SYSTEM

REPLAY = 600
POST_SECONDS = 10.0
WAIT = 0.5
PATIENCE = 5
BACKOFF = 60.0
LONGEST_WAIT = 300.0


def patterns(event) -> tuple:
    return (ANY, event.type, event.action, f"{event.type}.{event.action}", f"hook.{event.data.get('hook')}" if event.data.get("hook") else "", "hook.*" if event.data.get("hook") else "")


def listening(manifest: dict, event) -> list[dict]:
    known = patterns(event)
    return [handler for pattern, handler in (manifest.get("on") or {}).items() if pattern in known]


def its_own(event, plugin: str, resource: dict | None) -> bool:
    return event.actor == PLUGIN and ((resource or {}).get("data") or {}).get("plugin") == plugin


def post(url: str, payload: dict, token: str) -> tuple[bool, dict | str]:
    body = json.dumps(payload).encode()
    ask = urllib.request.Request(url, data=body, method="POST", headers={"Content-Type": "application/json", "X-Journal-Token": token})
    try:
        with urllib.request.urlopen(ask, timeout=POST_SECONDS) as answered:
            out = answered.read().decode(errors="replace")
    except (urllib.error.URLError, OSError, ValueError) as error:
        return False, f"{url} did not answer: {error}"
    if not out.strip():
        return True, {}
    try:
        reply = json.loads(out)
    except ValueError:
        return False, f"{url} answered with something other than JSON"
    if reply == []:
        return True, {}
    return (True, reply) if isinstance(reply, dict) else (False, f"{url} answered with something other than an object")


def watch(root: Path, journal) -> None:
    lock = Path(root) / "runtime" / "plugins.lock"
    lock.parent.mkdir(parents=True, exist_ok=True)
    with lock.open("w") as held:
        try:
            fcntl.flock(held, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            return
        host = Host(root, journal)
        while True:
            try:
                host.step(time.time())
            except (OSError, ValueError, Refused):
                pass
            time.sleep(WAIT)


class Host:
    def __init__(self, root: Path, journal, replay: float = REPLAY):
        self.root = Path(root)
        self.journal = journal
        self.replay = replay
        self.trouble: dict = {}
        self.turn = 0

    def environments(self) -> list[Record]:
        home = self.root / "environments"
        return [Record(self.root, p.name) for p in sorted(home.iterdir()) if p.is_dir()] if home.is_dir() else []

    def installed(self, record) -> list:
        return [r for r in Plugins(record, actor=SYSTEM)._standing() if r.enabled and r.manifest]

    def name(self, row) -> str:
        return str(row.manifest.get("name") or "")

    def cursor(self, record, plugin: str) -> str:
        return f"plugin-{plugin}"

    def step(self, now: float = 0.0) -> int:
        sent = 0
        names: list[str] = []
        for record in self.environments():
            for row in self.installed(record):
                sent += self.deliver(record, row, now)
                if self.name(row) not in names:
                    names.append(self.name(row))
        return sent + self.drained(names)

    def drained(self, names: list[str]) -> int:
        if not names:
            return 0
        self.turn = (self.turn + 1) % len(names)
        return drain(self.root, names[self.turn], default_env(self.root))

    def deliver(self, record, row, now: float = 0.0) -> int:
        plugin = self.name(row)
        if now and self.trouble.get(plugin, {}).get("until", 0) > now:
            return 0
        mark = self.cursor(record, plugin)
        since = record.cursor(mark)
        if not since:
            record.set_cursor(mark, record.last_event())
            return 0
        sent = 0
        for event in record.events(since=since):
            if now and event.at < now - self.replay:
                record.set_cursor(mark, event.id)
                continue
            ok, delivered = self.handle(record, row, event, now)
            if not ok:
                return sent
            record.set_cursor(mark, event.id)
            sent += delivered
        return sent

    def handle(self, record, row, event, now: float = 0.0) -> tuple[bool, int]:
        plugin = self.name(row)
        handlers = listening(row.manifest, event)
        if not handlers:
            return True, 0
        where = folder(record.root, plugin)
        payload = of(record, event, plugin, where)
        if its_own(event, plugin, payload.get("resource")):
            return True, 0
        env = environment(record.root, plugin, row.manifest, row.token)
        for handler in handlers:
            if handler.get("post"):
                ok, reply = post(fill(handler["post"], self.places(record, row)), payload, row.token)
                if not ok:
                    self.failed(record, plugin, reply, now)
                    return False, 0
            else:
                ok, reply = call(fill(handler["run"], env), where, env, payload, float(row.manifest.get("timeout") or SECONDS))
                if not ok:
                    self.failed(record, plugin, reply, now)
                    continue
            apply(record, self.journal, plugin, str(payload.get("agent", {}).get("session") or ""), reply if isinstance(reply, dict) else {})
            self.cleared(record, plugin)
        return True, 1

    def places(self, record, row) -> dict:
        ports = (row.settings or {}).get("ports") or {}
        return {**{f"ports.{name}": port for name, port in ports.items()}, "dir": str(folder(record.root, self.name(row)))}

    def failed(self, record, plugin: str, why, now: float = 0.0) -> None:
        where = log(record.root, plugin)
        where.parent.mkdir(parents=True, exist_ok=True)
        with where.open("a") as f:
            f.write(f"{why}\n")
        count = self.trouble.get(plugin, {}).get("failures", 0) + 1
        waited = min(BACKOFF * 2 ** max(0, count - PATIENCE), LONGEST_WAIT) if count >= PATIENCE else 0.0
        told = self.trouble.get(plugin, {}).get("notice", 0)
        if count == PATIENCE:
            told = self.journal.notice(record, "failing", name=plugin, plugin=plugin, why=str(why).strip().splitlines()[-1], log=where, tone="warn")
        self.trouble[plugin] = {"failures": count, "until": (now or time.time()) + waited, "notice": told}

    def cleared(self, record, plugin: str) -> None:
        told = self.trouble.pop(plugin, {}).get("notice")
        if told:
            self.journal.clear(record, told, "the plugin is answering again")
