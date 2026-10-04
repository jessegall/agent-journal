import fcntl
import json
import time
import urllib.error
import urllib.request
from pathlib import Path

from controllers.types import Plugins
from engine.bus import patterns
from engine import runtime
from engine.runtime import default_env
from engine.record import Record
from controllers.faults import threw
from features.plugins.answer import apply
from engine.wording import fill
from features.plugins.declared import Handler, Manifest, called, declared, settings_of
from features.plugins.environment import placed, port_values
from features.plugins.paths import folder, log, logged
from features.plugins.payload import of, session_of
from features.skill_loading.required import require_primary
from features.plugins.queue import Refusal, drain
from features.plugins.run import SECONDS, call, read
from features.plugins.skills import published
from resources.base import PLUGIN, SYSTEM

REPLAY = 600
POST_SECONDS = 10.0
WAIT = 0.5
PATIENCE = 5
BACKOFF = 60.0
LONGEST_WAIT = 300.0


def listening(manifest: Manifest, event) -> list[Handler]:
    return manifest.listening(patterns(event))


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
    ok, reply = read(out)
    return (True, reply) if ok else (False, f"{url}: {reply}")


def watch(root: Path, journal) -> None:
    lock = runtime.folder(root) / "plugins.lock"
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
            except Exception:
                threw(root, default_env(root), "delivering events to plugins")
            time.sleep(WAIT)


class Host:
    def __init__(self, root: Path, journal, replay: float = REPLAY):
        self.root = Path(root)
        self.journal = journal
        self.replay = replay
        self.trouble: dict = {}
        self.told: set[tuple[str, str]] = set()
        self.turn = 0

    def environments(self) -> list[Record]:
        return Record.every(self.root)

    def step(self, now: float = 0.0) -> int:
        sent = 0
        names: list[str] = []
        for record in self.environments():
            for row in Plugins(record, actor=SYSTEM)._installed():
                sent += self.deliver(record, row, now)
                if called(row) not in names:
                    names.append(called(row))
        return sent + self.drained(names)

    def drained(self, names: list[str]) -> int:
        if not names:
            return 0
        self.turn = (self.turn + 1) % len(names)
        plugin = names[self.turn]
        done, refused = drain(self.root, plugin, default_env(self.root))
        for refusal in refused:
            self.refusal(plugin, refusal)
        return done

    def refusal(self, plugin: str, refusal: Refusal) -> None:
        if (plugin, refusal.why) in self.told:
            return
        self.told.add((plugin, refusal.why))
        record = Record(self.root, refusal.env)
        self.journal.notice(record, "refused", name=plugin, queued=refusal.line[:200], why=refusal.why, log=log(self.root, plugin), tone="warn")

    def deliver(self, record, row, now: float = 0.0) -> int:
        plugin = called(row)
        if now and self.trouble.get(plugin, {}).get("until", 0) > now:
            return 0
        mark = f"plugin-{plugin}"
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
        manifest = declared(row)
        skills = manifest.skills_for(patterns(event))
        if skills:
            require_primary(record, skills, event.at)
        handlers = listening(manifest, event)
        if not handlers:
            return True, 0
        plugin, where, env = placed(record, row)
        payload = of(record, event, plugin, where)
        if its_own(event, plugin, payload.get("resource")):
            return True, 0
        for handler in handlers:
            if handler.post:
                ok, reply = post(fill(handler.post, self.places(record, row)), payload, row.token)
                if not ok:
                    self.failed(record, plugin, reply, now)
                    return False, 0
            else:
                ok, reply = call(fill(handler.run, env), where, env, payload, SECONDS)
                if not ok:
                    self.failed(record, plugin, reply, now)
                    continue
            if reply:
                logged(record.root, plugin, f"{payload.get('event')} {json.dumps(reply, ensure_ascii=False)}")
            apply(record, self.journal, plugin, session_of(event), reply if isinstance(reply, dict) else {})
            self.cleared(record, plugin)
        if event.type == "plugin":
            published(record.root, plugin, manifest)
        return True, 1

    def places(self, record, row) -> dict:
        return {**port_values(settings_of(row).ports), "dir": str(folder(record.root, called(row)))}

    def failed(self, record, plugin: str, why, now: float = 0.0) -> None:
        logged(record.root, plugin, why)
        where = log(record.root, plugin)
        count = self.trouble.get(plugin, {}).get("failures", 0) + 1
        waited = min(BACKOFF * 2 ** max(0, count - PATIENCE), LONGEST_WAIT) if count >= PATIENCE else 0.0
        notice = self.trouble.get(plugin, {}).get("notice")
        if count == PATIENCE:
            notice = self.journal.notice(record, "failing", name=plugin, plugin=plugin, why=str(why).strip().splitlines()[-1], log=where, tone="warn")
        self.trouble[plugin] = {"failures": count, "until": (now or time.time()) + waited, "notice": notice}

    def cleared(self, record, plugin: str) -> None:
        notice = self.trouble.pop(plugin, {}).get("notice")
        if notice:
            self.journal.clear(record, notice, "the plugin is answering again")
