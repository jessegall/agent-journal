import json
import shutil
import time
from contextlib import contextmanager
from pathlib import Path

from engine.services import UP, want
from engine.version import version
from engine.wording import fill
from features.plugins.answer import apply
from features.plugins.declared import Manifest, called, removed, settings_with
from features.plugins.environment import environment
from features.plugins.manifest import MANIFEST, read
from features.plugins.paths import data, folder, home, log, logged
from features.plugins.run import SECONDS, call
from features.plugins.setup import checked, prepared
from features.plugins.skills import published
from features.plugins.staging import Staged, followed, on_disk, said_version, staged


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


@contextmanager
def fetched(root: Path, source: str, revision: str):
    stage = staged(root, source, revision, version())
    try:
        yield stage
    finally:
        drop(stage.where, stage.linked)


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
    kept = {"source": source, "revision": ref, "commit": commit, "version": said_version(target, manifest), "linked": linked, "manifest": manifest.stored, "update": {}}
    published(plugins.record.root, name, manifest)
    held = ports if ports else {}
    if row:
        return plugins.update(row.n, abstract=manifest.description, settings=settings_with(row, ports=held), **kept)
    fresh = {"abstract": manifest.description, "enabled": True, "settings": {"ports": held}, "token": secret, **kept}
    earlier = removed(plugins, name)
    if earlier is None:
        return plugins.create(manifest.heading, **fresh)
    plugins.reopen(earlier.n, "installed again")
    return plugins.update(earlier.n, title=manifest.heading, **fresh)


def welcomed(journal, plugins, manifest: Manifest, env: dict) -> None:
    step = manifest.installed
    if not step:
        return
    root, name = plugins.record.root, manifest.name
    ok, reply = call(fill(step, env), folder(root, name), env, {"event": "plugin.installed"}, SECONDS)
    logged(root, name, f"installed {json.dumps(reply, ensure_ascii=False) if ok else reply}")
    if ok and isinstance(reply, dict):
        apply(plugins.record, journal, name, "", reply)


def install_staged(journal, plugins, stage: Staged, source: str, ref: str, secret: str, ports: dict, chosen: dict | None = None, row=None):
    root, manifest = plugins.record.root, stage.manifest
    with on_disk(manifest.name):
        env = environment(root, manifest.name, manifest, secret, ports, chosen)
        checked(manifest, stage.where, env)
        data(root, manifest.name).mkdir(parents=True, exist_ok=True)
        prepared(manifest, stage.where, env, log(root, manifest.name))
        made = place(plugins, stage.where, stage.linked, manifest, source, followed(ref), stage.commit, secret, row=row, ports=ports)
        welcomed(journal, plugins, manifest, env)
        restarted(root, manifest)
    return made


def reread(plugins, row):
    where = folder(plugins.record.root, called(row))
    manifest = read(where, version())
    restarted(plugins.record.root, manifest)
    return plugins.update(row.n, manifest=manifest.stored, version=said_version(where, manifest), abstract=manifest.description,
                          read_at=time.time())


def changed_on_disk(plugins, row) -> bool:
    path = folder(plugins.record.root, called(row)) / MANIFEST
    return row.linked and path.is_file() and path.stat().st_mtime > (row.read_at or row.updated)
