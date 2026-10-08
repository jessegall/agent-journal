import re
from dataclasses import fields
from pathlib import Path

import features
from engine.record import Record
from features.phone.chat_view import MARKED, RECALLED
from features.format import catalogue
from features import groups
from controllers.base import actions
from controllers.base import Controller
from controllers.described import described_types
from resources.base import ACTIONS, ACTORS, SCOPES, VIEWS, Resource
from resources.types import priority
from engine import runtime
from providers import PROVIDERS
from engine.version import version
from engine.package import data
from features.open_viewer.attachments import listed_types
from typing import TypedDict


def built() -> str:
    page = data("web", "dist", "index.html")
    found = re.search(r"assets/(index-[^\"]+\.js)", page.read_text()) if page.is_file() else None
    return found.group(1) if found else ""


class Manifest(TypedDict):
    project: str
    environment: str
    version: str
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


def default_models() -> list[dict]:
    return [{"provider": name, "model": kind.dispatch_default, "label": kind().model_labels().get(kind.dispatch_default, kind.dispatch_default)}
            for name, kind in PROVIDERS.items()]


def built_in() -> dict:
    return {"types": described_types(), "chat_kinds": {"recalled": RECALLED, "marked": MARKED}}


def manifest(root: Path) -> Manifest:
    return {
        "project": root.resolve().parent.name,
        "environment": runtime.env(root),
        "version": version(),
        "build": built(),
        "actions": list(ACTIONS),
        "actors": list(ACTORS),
        "views": list(VIEWS),
        "scopes": list(SCOPES),
        "priority": priority(),
        "fields": [f.name for f in fields(Resource)],
        "methods": actions(Controller),
        "features": catalogue(features.describe(), Record(root, runtime.env(root))),
        "groups": groups.describe(),
        "models": default_models(),
        "searchable": listed_types(),
        **built_in(),
    }
