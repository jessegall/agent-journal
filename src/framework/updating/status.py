from pathlib import Path

from engine import runtime
from engine.package import data
from engine.upgrades import FETCHING, newer, upstream
from engine.version import version

CHANGELOG = data("CHANGELOG.md")


def standing(root: Path) -> dict:
    """The installed version, the newest the journal knows of, and whether a check or an upgrade is running."""
    cache = runtime.upstream_cache(root)
    latest = cache.read_text().strip() if cache.is_file() else ""
    return {"version": version(), "latest": latest, "newer": newer(latest, version()), "checking": FETCHING.locked(), "updating": runtime.upgrade_mark(root).exists()}


def upgrading(root: Path) -> bool:
    return runtime.upgrading(root)


def upstream_standing(root: Path) -> dict:
    installed, latest = version(), upstream(root)
    return {"installed": installed, "latest": latest, "newer": newer(latest, installed)}
