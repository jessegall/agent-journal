import json
import os
from pathlib import Path
from typing import NamedTuple

from engine.runtime import default_env
from engine.services import claimed
from engine.viewer import lately_running
from engine.wording import fill
from features.plugins.declared import Manifest, called, declared, settings_of
from features.plugins.paths import data, folder, plugin_socket, queue_path
from features.secrets.values import ValuesFile


def port_values(ports: dict) -> dict:
    return {f"ports.{service}": port for service, port in ports.items()}


def values(root: Path, name: str, token: str, ports: dict | None = None, env: str | None = None) -> dict:
    return {"dir": str(folder(root, name)), "data": str(data(root, name)), "root": str(Path(root)), "project": str(Path(root).parent),
            "journal.url": lately_running(Path(root)) or "", "journal.env": default_env(Path(root)) if env is None else env, "token": token,
            "queue": str(queue_path(root, name, env)), **port_values(ports or {})}


def ports_for(root: Path, manifest: Manifest) -> dict:
    taken: set[int] = set()
    given = {}
    for service in (service for service in manifest.services if service.port is not None):
        port, blocked = claimed(root, f"{manifest.name}.{service.name}", service.port, taken)
        if port:
            given[service.name] = port
    return given


def own_journal(root: Path) -> Path:
    bin_dir = Path(root) / "runtime" / "plugin-bin"
    link = bin_dir / "journal"
    if not link.is_symlink() or link.resolve() != (Path(root) / "journal").resolve():
        bin_dir.mkdir(parents=True, exist_ok=True)
        link.unlink(missing_ok=True)
        link.symlink_to(Path(root).resolve() / "journal")
    return bin_dir


def chosen_values(manifest: Manifest, chosen: dict | None) -> dict:
    picked = chosen if chosen else {}
    return {setting.key: str(picked.get(setting.key, setting.default)) for setting in manifest.settings}


def chosen_env(root: Path, manifest: Manifest, chosen: dict | None) -> dict:
    values = chosen_values(manifest, chosen)
    held = ValuesFile(root).values() if any(setting.is_secret() for setting in manifest.settings) else {}
    named = {setting.env: held.get(values[setting.key], "") if setting.is_secret() else values[setting.key] for setting in manifest.settings if setting.env}
    return {**named, "JOURNAL_SETTINGS": json.dumps(values)}


def environment(root: Path, name: str, manifest: Manifest, token: str, ports: dict | None = None, chosen: dict | None = None, env: str | None = None) -> dict:
    where = values(root, name, token, ports, env)
    given = fill(manifest.env, where)
    path = f"{own_journal(root)}{os.pathsep}{os.environ.get('PATH', '')}"
    return {**os.environ, "PATH": path, **{str(k): str(v) for k, v in given.items()}, **chosen_env(root, manifest, chosen),
            "JOURNAL_ROOT": where["root"], "JOURNAL_URL": where["journal.url"], "JOURNAL_TOKEN": token,
            "JOURNAL": str(Path(root) / "journal"), "JOURNAL_ENV": where["journal.env"], "JOURNAL_PLUGIN": name,
            "JOURNAL_PLUGIN_DIR": where["dir"], "JOURNAL_PLUGIN_DATA": where["data"], "JOURNAL_QUEUE": where["queue"],
            "JOURNAL_PLUGIN_SOCKET": str(plugin_socket(root, name))}


class Placement(NamedTuple):
    name: str
    folder: Path
    environ: dict


def placed(record, row) -> Placement:
    name = called(row)
    return Placement(name, folder(record.root, name), environment(record.root, name, declared(row), row.token, chosen=settings_of(row).chosen, env=record.env))
