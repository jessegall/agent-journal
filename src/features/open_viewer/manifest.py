import re
from dataclasses import fields
from pathlib import Path

import features
from engine.record import Record
from features.phone.chat_view import TURNS
from framework.format import catalogue
from declaring import groups
from controllers.base import actions
from controllers.base import Controller
from controllers.described import described_types
from resources.base import ACTIONS, ACTORS, SCOPES, SYSTEM, VIEWS, Resource
from resources.types import priority
from engine import runtime
from engine.version import version
from engine.package import data
from features.open_viewer.attachments import listed_types
from framework.watched import FACTS
from controllers.nudges import Nudges
from typing import TypedDict
from serving import SERVED, Providers


def built() -> str:
    page = data("web", "dist", "index.html")
    found = re.search(r'<script[^>]*type="module"[^>]*src="[^"]*assets/([^"]+\.js)"', page.read_text()) if page.is_file() else None
    return found.group(1) if found else ""


class Manifest(TypedDict):
    project: str
    environment: str
    version: str
    branch: str
    build: str
    actions: list[str]
    actors: list[str]
    views: list[str]
    scopes: list[str]
    priority: dict
    fields: list[str]
    methods: tuple[str, ...]
    types: dict[str, dict]
    features: dict
    groups: list[groups.Described]
    models: list[dict]
    searchable: list[str]
    chat_kinds: dict[str, dict[str, str]]
    facts: list[dict]
    spoken: dict[str, dict]


def default_models() -> list[dict]:
    return [{"provider": agent.name, "model": agent.dispatch_default, "label": agent.model_labels().get(agent.dispatch_default, agent.dispatch_default)}
            for agent in SERVED.given(Providers).every()]


def built_in() -> dict:
    return {"types": described_types(), "chat_kinds": {"turns": TURNS}}


def watchable(record: Record) -> list[dict]:
    return [{"value": fact.name, "label": fact.label, "phrase": fact.phrase, "unit": fact.unit, "fills": list(fact.fills)} for fact in FACTS.each(record)]


def manifest(root: Path) -> Manifest:
    from framework.updating.branch import followed_branch
    record = Record(root, runtime.env(root))
    return {
        "project": root.resolve().parent.name,
        "environment": runtime.env(root),
        "version": version(),
        "branch": followed_branch(root),
        "build": built(),
        "actions": list(ACTIONS),
        "actors": list(ACTORS),
        "views": list(VIEWS),
        "scopes": list(SCOPES),
        "priority": priority(),
        "fields": [f.name for f in fields(Resource)],
        "methods": actions(Controller),
        "features": catalogue(features.describe(), record),
        "groups": groups.describe(),
        "models": default_models(),
        "searchable": listed_types(),
        "facts": watchable(record),
        "spoken": Nudges(record, actor=SYSTEM).spoken(),
        **built_in(),
    }
