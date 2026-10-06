import json
import secrets
import shutil
import threading
import time
from dataclasses import asdict, dataclass, field
from pathlib import Path

from controllers.types import Agents, Plugins
from engine.events.agents import SessionStarted
from engine.fields import Loaded
from engine.stored import write_text
from engine.upgrades import fetch
from engine.worktree import lines
from features.parts import AgentContext, Handler
from features.plugins.declared import Fits, called
from features.plugins.lifecycle import fetched
from features.plugins.paths import home
from features.plugins.preview import RUNS_AS, preview_rows
from features.suggestions.controller import INSTALL, OPEN_SUGGESTIONS, Suggestions
from resources.base import Refused, SYSTEM, USER

LISTED = "plugins.json"
KEPT = "plugin-offers.json"
FRESH_FOR = 86400
YES = "Yes, I want this"
LANGUAGES = {".php": "PHP", ".py": "Python", ".ts": "TypeScript", ".vue": "Vue", ".cs": "C#"}
REFRESHING = threading.Lock()


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
        commands = "\n".join(f"- {command}" for command in self.commands)
        return f"""This project has {', '.join(found)}. The {self.title} plugin describes itself in its own words: "{self.description}"

{RUNS_AS}

{commands}"""

    def button(self) -> dict:
        return {"label": YES, "type": "plugin", "action": "install", "body": {"source": self.source, "ref": self.commit, "yes": True}}


def written_in(names: list[str]) -> set[str]:
    return {LANGUAGES[suffix] for suffix in {Path(name).suffix for name in names} if suffix in LANGUAGES}


def official(root: Path) -> list[Listed]:
    staging = home(root) / f".staging-{secrets.token_hex(4)}"
    try:
        if fetch(staging, "")[1]:
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
    names = lines(record.root.parent, "ls-files")
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
        suggestions.create(offer.suggestion(), brief=offer.brief(found), plugin=offer.source, buttons=[offer.button()])


def refresh(record) -> None:
    if not REFRESHING.acquire(blocking=False):
        return
    try:
        suggest(record, offers_read(record.root))
    finally:
        REFRESHING.release()


def mark_failed(plugins, source: str, why: str) -> None:
    if plugins.actor != USER:
        return
    agents = Agents(plugins.record, actor=SYSTEM)
    row = agents.primary()
    if not row:
        return
    agents.card(row.n, label=f"Could not install the plugin from {source}", detail=why, icon="warn", tone="warn")


def mark_installed(plugins, source: str, made) -> None:
    if plugins.actor != USER:
        return
    suggestions = Suggestions(plugins.record, actor=SYSTEM)
    for row in [row for row in suggestions.rows.standing() if row.data.get("plugin") == source]:
        suggestions.complete(row.n, f"{INSTALL}: {called(made)} was installed")
    agents = Agents(plugins.record, actor=SYSTEM)
    row = agents.primary()
    if row:
        agents.card(row.n, label=f"You installed the {called(made)} plugin", icon="check", side=USER, row=made.ref)


class SuggestFittingPlugins(Handler):
    def handle(self, context: AgentContext, event: SessionStarted) -> None:
        record = context.record
        if offers_fresh(record.root):
            suggest(record, offers_kept(record.root))
            return
        threading.Thread(target=refresh, args=(record,), name="plugin-fit", daemon=True).start()
