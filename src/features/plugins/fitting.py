import json
import secrets
import shutil
import threading
import time
from dataclasses import asdict, dataclass, field
from pathlib import Path

from controllers.types import Agents, Environments, Plugins
from engine.events.engine import ClockTicked
from resources.fields import Loaded
from engine.stored import write_text
from engine.upgrades import fetch
from engine.worktree import tracked_files
from features.parts import AgentContext, Handler
from features.plugins.declared import Fits, called
from features.plugins.lifecycle import fetched
from features.plugins.paths import home
from features.plugins.preview import preview_rows
from features.plugins.staging import Unreached
from features.suggestions.controller import Decision, OPEN_SUGGESTIONS, Suggestions
from resources.base import Refused, SYSTEM, USER

LISTED = "plugins.json"
KEPT = "plugin-offers.json"
FRESH_FOR = 86400
WORKED_FIRST = 3600
LANGUAGES = {".php": "PHP", ".py": "Python", ".ts": "TypeScript", ".vue": "Vue", ".cs": "C#"}
REFRESHING: dict[Path, threading.Lock] = {}


@dataclass(frozen=True)
class Listed(Loaded):
    source: str = ""
    title: str = ""


@dataclass(frozen=True)
class Offer(Loaded):
    source: str = ""
    title: str = ""
    description: str = ""
    fits: Fits = field(default_factory=Fits)
    commit: str = ""
    commands: tuple[str, ...] = ()

    def suggestion(self) -> str:
        return f"Install the {self.title} plugin"

    def brief(self, found: list[str]) -> str:
        return f"This project has {', '.join(found)}, which the {self.title} plugin is made for."


def written_in(names: list[str]) -> set[str]:
    return {LANGUAGES[suffix] for suffix in {Path(name).suffix for name in names} if suffix in LANGUAGES}


def official(root: Path) -> list[Listed]:
    staging = home(root) / f".staging-{secrets.token_hex(4)}"
    try:
        if fetch(staging)[1]:
            return []
        return [Listed.from_json(one) for one in json.loads((staging / LISTED).read_text())]
    except (OSError, ValueError):
        return []
    finally:
        shutil.rmtree(staging, ignore_errors=True)


def offer_of(root: Path, listed: Listed) -> list[Offer]:
    try:
        with fetched(root, listed.source, "") as stage:
            manifest = stage.manifest
            commands = tuple(row.line() for row in preview_rows(manifest))
            return [Offer(listed.source, listed.title or manifest.heading, manifest.description, manifest.fits, stage.commit, commands)]
    except Refused:
        return []


def offers_kept(root: Path) -> list[Offer]:
    try:
        return [Offer.from_json(one) for one in json.loads((Path(root) / "runtime" / KEPT).read_text())["offers"]]
    except (OSError, ValueError, KeyError):
        return []


def offers_fresh(root: Path) -> bool:
    try:
        return time.time() - (Path(root) / "runtime" / KEPT).stat().st_mtime < FRESH_FOR
    except OSError:
        return False


def offers_read(root: Path) -> list[Offer]:
    listed = official(root)
    offers = [offer for one in listed for offer in offer_of(root, one)] if listed else offers_kept(root)
    kept = Path(root) / "runtime" / KEPT
    kept.parent.mkdir(parents=True, exist_ok=True)
    write_text(kept, json.dumps({"offers": [asdict(offer) for offer in offers]}))
    return offers


def suggest(record, offers: list[Offer]) -> None:
    names = tracked_files(record.root.parent)
    spoken = written_in(names)
    installed = {row.source for row in Plugins(record, actor=SYSTEM).rows.every()}
    suggestions = Suggestions(record, actor=SYSTEM)
    made = {row.title for row in suggestions.rows.every()}
    for offer in offers:
        found = offer.fits.found(spoken, names)
        if not found or offer.source in installed or offer.suggestion() in made:
            continue
        if len(suggestions.rows.standing()) >= OPEN_SUGGESTIONS:
            return
        suggestions.create(offer.suggestion(), brief=offer.brief(found), plugin=offer.source, commit=offer.commit, name=offer.title,
                           described=offer.description, runs=list(offer.commands))


def refresh(record) -> None:
    refreshing = REFRESHING.setdefault(Path(record.root), threading.Lock())
    if not refreshing.acquire(blocking=False):
        return
    try:
        suggest(record, offers_read(record.root))
    finally:
        refreshing.release()


@dataclass(frozen=True)
class InstallMark:
    plugins: object
    source: str
    key: str
    tried: int
    offered: tuple

    @classmethod
    def begin(cls, plugins, source: str) -> "InstallMark":
        suggestions = Suggestions(plugins.record, actor=SYSTEM)
        offered = tuple(row for row in suggestions.rows.standing() if row.data.get("plugin") == source)
        tried = 1 + max((row.data.get("install", {}).get("try", 0) for row in offered), default=0)
        key = f"install:{offered[0].n}:{tried}" if offered else f"install:{source}:{time.time()}"
        mark = cls(plugins, source, key, tried, offered)
        mark.state(state="running")
        mark.card(label="Installing", name=offered[0].data.get("name", source) if offered else source, state="running", started=time.time(),
                  row=offered[0].ref if offered else "")
        return mark

    def state(self, **install) -> None:
        suggestions = Suggestions(self.plugins.record, actor=SYSTEM)
        for row in self.offered:
            suggestions.update(row.n, install={"try": self.tried, **install})

    def card(self, **card) -> None:
        agents = Agents(self.plugins.record, actor=SYSTEM)
        row = agents.primary()
        if self.plugins.actor != USER or not row:
            return
        agents.card(row.n, key=self.key, icon="plug", side=USER, **card)

    def failed(self, error: Refused) -> None:
        self.state(state="failed", why=str(error), network=isinstance(error, Unreached))
        self.card(label="Install failed for", state="failed", ended=time.time(), detail=f"{error} Nothing was kept.")

    def installed(self, made) -> None:
        suggestions = Suggestions(self.plugins.record, actor=SYSTEM)
        for row in self.offered:
            suggestions.complete(row.n, f"{Decision.INSTALL}: {called(made)} was installed", installed=made.ref)
        self.card(label="Installed", name=called(made), state="done", ended=time.time(), row=made.ref)


def in_use_since(record, agent) -> float:
    place = Environments(record, actor=SYSTEM).rows.by_title(record.env)
    return min(float(agent.started or time.time()), float(place.created) if place else time.time())


class SuggestFittingPlugins(Handler):
    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        record = context.record
        if time.time() - in_use_since(record, context.agent.row) < WORKED_FIRST:
            return
        if offers_fresh(record.root):
            suggest(record, offers_kept(record.root))
            return
        threading.Thread(target=refresh, args=(record,), name="plugin-fit", daemon=True).start()
