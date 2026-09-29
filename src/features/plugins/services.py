import threading
import time
from dataclasses import replace
from pathlib import Path

from controllers.faults import threw
from controllers.types import Notices, Plugins
from engine.runtime import default_env
from engine.keeper import ServiceSpec
from engine.record import Record
from engine.services import BLOCKED, FAILED, allocate, files_for, log_file, states
from features.plugins.declared import declared, settings_of
from features.plugins.manifest import fill
from features.plugins.source import environment, folder
from resources.base import SYSTEM

WATCH = 5.0
TOLD = "service"


def watch(root: Path, feature) -> None:
    threading.Thread(target=keep, args=(Path(root), feature), daemon=True).start()


def keep(root: Path, feature) -> None:
    while True:
        try:
            notice_stopped(root, feature)
        except Exception:
            threw(root, default_env(root), "watching plugin services")
        time.sleep(WATCH)


def here(root: Path) -> Record:
    return Record(Path(root), default_env(Path(root)))


def notice_stopped(root: Path, feature) -> list[str]:
    record = here(root)
    if not feature.enabled(record):
        return []
    open_ = {n.data.get(TOLD): n for n in feature.standing(record, Notices) if n.data.get(TOLD)}
    stopped = []
    for sid, state in states(root).items():
        failing = state.state in (FAILED, BLOCKED)
        if failing and sid not in open_:
            feature.journal.notice(record, "stopped", name=sid, why=state.why if state.why else "it stopped", log=log_file(root, sid), tone="warn", **{TOLD: sid})
            stopped.append(sid)
        if not failing and sid in open_:
            feature.journal.clear(record, open_[sid], "it is running again")
    return stopped


def plugins(root: Path) -> list:
    home = Path(root) / "environments"
    first = sorted(p.name for p in home.iterdir() if p.is_dir()) if home.is_dir() else []
    record = Record(Path(root), first[0] if first else "main")
    return Plugins(record, actor=SYSTEM)._installed()


def planned(root: Path, name: str, service, port: int, blocked: str, env: dict, where: Path) -> ServiceSpec:
    sid = f"{name}.{service.name}"
    return ServiceSpec(id=sid, plugin=name, service=service.name, port=port, blocked=blocked, run=service.run, cwd=str(where / service.cwd),
                       env={**env, **service.env}, path=service.ready.path, restart=service.restart, grace=service.grace, show=service.show,
                       when=service.when, **files_for(root, sid))


def plugin_services(root: Path, taken: set[int]) -> list[ServiceSpec]:
    out: list[ServiceSpec] = []
    for row in plugins(root):
        manifest = declared(row)
        name = manifest.name
        where = folder(root, name)
        settings = settings_of(row)
        kept = settings.ports
        env = environment(root, name, manifest, row.token, kept, settings.chosen)
        ports = {f"ports.{service}": port for service, port in kept.items()}
        made = []
        for service in manifest.services:
            asked = kept[service.name] if kept.get(service.name) else service.port
            port, blocked = allocate(root, f"{name}.{service.name}", asked, taken) if service.port is not None else (0, "")
            if port:
                taken.add(port)
                ports[f"ports.{service.name}"] = port
            made.append(planned(root, name, service, port, blocked, env, where))
        for spec in made:
            places = {**ports, "port": spec.port, "dir": str(where)}
            out.append(replace(spec, run=fill(spec.run, places), when=str(fill(spec.when, places)), env={key: str(fill(value, places)) for key, value in spec.env.items()},
                               url=f"http://127.0.0.1:{spec.port}" if spec.port else ""))
    return out
