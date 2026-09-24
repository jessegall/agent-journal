import shutil
import time
from pathlib import Path

from engine.services import UP, want
from engine.version import version
from features.plugins.declared import Manifest, declared, settings_of
from features.plugins.manifest import MANIFEST, read
from features.plugins.skills import published
from features.plugins.source import folder, home, said_version
from dataclasses import replace


def called(row) -> str:
    return declared(row).name


def runs(manifest: Manifest) -> list[str]:
    steps = [f"setup {step.name}: {step.run}" for step in manifest.setup]
    servers = [f"service {service.name}: {service.run}" for service in manifest.services]
    handlers = [f"on {handler.pattern}: {handler.post if handler.post else handler.run}" for handler in manifest.handlers]
    return [*steps, *servers, *handlers]


def changed(before: Manifest, after: Manifest) -> list[dict]:
    was, now = runs(before), runs(after)
    return [*({"kind": "gone", "line": line} for line in was if line not in now), *({"kind": "new", "line": line} for line in now if line not in was)]


def difference(before: Manifest, after: Manifest) -> str:
    lines = changed(before, after)
    if not lines:
        return "It runs the same commands as the version you have."
    words = {"gone": "no longer", "new": "now also"}
    return "\n".join(["What it runs changes:", *(f"  {words[c['kind']]}: {c['line']}" for c in lines)])


def clear(target: Path) -> None:
    if target.is_symlink():
        target.unlink()
    else:
        shutil.rmtree(target, ignore_errors=True)


def drop(staging: Path, linked: bool) -> None:
    if not linked:
        shutil.rmtree(staging, ignore_errors=True)


def restarted(root: Path, manifest: Manifest) -> None:
    for service in manifest.services:
        want(root, f"{manifest.name}.{service.name}", UP, nonce=time.time())


def place(plugins, where: Path, linked: bool, manifest: Manifest, source: str, ref: str, commit: str, secret: str, row=None, ports: dict | None = None):
    name = manifest.name
    target = folder(plugins.record.root, name)
    home(plugins.record.root).mkdir(parents=True, exist_ok=True)
    clear(target)
    if linked:
        target.symlink_to(where)
    else:
        where.rename(target)
    kept = {"source": source, "revision": ref, "commit": commit, "version": said_version(target, manifest), "linked": linked, "manifest": manifest.stored}
    published(plugins.record.root, name, manifest)
    held = ports if ports else {}
    if row:
        return plugins.update(row.n, abstract=manifest.description, settings=replace(settings_of(row), ports=held).to_json(), **kept)
    return plugins.create(manifest.heading, abstract=manifest.description, enabled=True, settings={"ports": held}, token=secret, **kept)


def reread(plugins, row):
    where = folder(plugins.record.root, called(row))
    manifest = read(where, version())
    restarted(plugins.record.root, manifest)
    return plugins.update(row.n, manifest=manifest.stored, version=said_version(where, manifest), abstract=manifest.description,
                          read_at=time.time())


def changed_on_disk(plugins, row) -> bool:
    path = folder(plugins.record.root, called(row)) / MANIFEST
    return row.linked and path.is_file() and path.stat().st_mtime > (row.read_at or row.updated)
