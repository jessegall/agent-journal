import fcntl
import re
import secrets
import shutil
from contextlib import contextmanager
from pathlib import Path
from typing import NamedTuple

from features.plugins.declared import Manifest
from features.plugins.manifest import read
from features.plugins.paths import busy_file, home
from engine.upgrades import fetch
from resources.base import Refused

REPOSITORY = re.compile(r"[\w.-]+/[\w.-]+$")
REMOTE = ("http://", "https://", "git@", "file://", "ssh://")


def remote(address: str) -> bool:
    return address.startswith(REMOTE)


def address(source: str) -> str:
    given = str(source).strip()
    local = Path(given).expanduser()
    if local.exists():
        return str(local.resolve())
    if remote(given):
        return given
    if REPOSITORY.fullmatch(given):
        return f"https://github.com/{given}"
    raise Refused(f"{given!r} is neither a repository URL, an owner/repo, nor a folder on this machine")


def said_version(where: Path, manifest: Manifest) -> str:
    if manifest.version:
        return manifest.version
    kept = Path(where) / "VERSION"
    try:
        return kept.read_text().strip()[:32]
    except OSError:
        return ""


class Staged(NamedTuple):
    where: Path
    manifest: Manifest
    commit: str
    linked: bool


def staged(root: Path, source: str, revision: str, version: str) -> Staged:
    where = address(source)
    linked = not remote(where)
    if linked:
        return Staged(Path(where), read(Path(where), version), "", True)
    staging = home(root) / f".staging-{secrets.token_hex(4)}"
    commit, failed = fetch(staging, where, revision)
    if failed:
        shutil.rmtree(staging, ignore_errors=True)
        raise Refused(f"{where} could not be fetched: {failed}")
    try:
        return Staged(staging, read(staging, version), commit, False)
    except Refused:
        shutil.rmtree(staging, ignore_errors=True)
        raise


def alone(root: Path, name: str):
    lock = busy_file(root, name)
    with on_disk(name):
        lock.parent.mkdir(parents=True, exist_ok=True)
        held = lock.open("w")
    try:
        fcntl.flock(held, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError as error:
        held.close()
        raise Refused(f"{name} is being installed already; wait for that to finish") from error
    return held


@contextmanager
def on_disk(name: str):
    try:
        yield
    except OSError as error:
        raise Refused(f"{name} could not be written to disk: {error}") from error


def token() -> str:
    return secrets.token_hex(16)
