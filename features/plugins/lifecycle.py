import shutil
import time
from pathlib import Path

from engine.services import UP, want
from features.plugins.skills import published
from features.plugins.source import folder, home, said_version


def called(row) -> str:
    return str((row.manifest or {}).get("name") or "")


def runs(manifest: dict) -> list[str]:
    steps = [f"setup {step['name']}: {step['run']}" for step in manifest.get("setup") or []]
    servers = [f"service {name}: {spec['run']}" for name, spec in (manifest.get("services") or {}).items()]
    handlers = [f"on {pattern}: {handler.get('post') or handler.get('run')}" for pattern, handler in (manifest.get("on") or {}).items()]
    return [*steps, *servers, *handlers]


def changed(before: dict, after: dict) -> list[dict]:
    was, now = runs(before), runs(after)
    return [*({"kind": "gone", "line": line} for line in was if line not in now), *({"kind": "new", "line": line} for line in now if line not in was)]


def difference(before: dict, after: dict) -> str:
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


def restarted(root: Path, manifest: dict) -> None:
    for service in (manifest.get("services") or {}):
        want(root, f"{manifest['name']}.{service}", UP, nonce=time.time())


def place(plugins, where: Path, linked: bool, manifest: dict, source: str, ref: str, commit: str, secret: str, row=None, ports: dict | None = None):
    name = manifest["name"]
    target = folder(plugins.record.root, name)
    home(plugins.record.root).mkdir(parents=True, exist_ok=True)
    clear(target)
    if linked:
        target.symlink_to(where)
    else:
        where.rename(target)
    kept = {"source": source, "revision": ref, "commit": commit, "version": said_version(target, manifest), "linked": linked, "manifest": manifest}
    published(plugins.record.root, name, manifest)
    if row:
        return plugins.update(row.n, abstract=manifest.get("description") or "", settings={**(row.settings or {}), "ports": ports or {}}, **kept)
    return plugins.create(manifest.get("title") or name, abstract=manifest.get("description") or "", enabled=True, settings={"ports": ports or {}}, token=secret, **kept)
