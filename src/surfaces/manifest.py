import re
from dataclasses import fields
from pathlib import Path

import features
from features import groups
from controllers.base import actions
from controllers.base import Controller
from controllers.described import described_types
from resources.base import ACTIONS, ACTORS, SCOPES, VIEWS, Resource
from resources.types import priority
from engine import runtime
from engine.version import version
from engine.package import data
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


def manifest(root: Path | None = None) -> Manifest:
    return {
        "project": root.resolve().parent.name if root else "",
        "environment": runtime.env(root) if root else runtime.DEFAULT_ENV,
        "version": version(),
        "build": built(),
        "actions": list(ACTIONS),
        "actors": list(ACTORS),
        "views": list(VIEWS),
        "scopes": list(SCOPES),
        "priority": priority(),
        "fields": [f.name for f in fields(Resource)],
        "methods": actions(Controller),
        "types": described_types(),
        "features": features.describe(),
        "groups": groups.describe(),
    }
