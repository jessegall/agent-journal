import fcntl
import hashlib
import json
import os
import re
import secrets
import shutil
import subprocess
import time
from dataclasses import asdict, dataclass
from pathlib import Path

from engine.proc import streamed

from engine.hooks import default_env
from engine.viewer import running
from features.plugins.declared import Manifest, command_text
from features.plugins.manifest import fill, read
from install import fetch
from resources.base import Refused

HOME = "plugins"
CHOSEN = "chosen"
DATA = "plugin-data"
LOGS = "plugins"
REPOSITORY = re.compile(r"[\w.-]+/[\w.-]+$")
SETUP_SECONDS = 900
CHECK_SECONDS = 60
SHOWN_LINES = 40


def home(root: Path) -> Path:
    return Path(root) / HOME


def folder(root: Path, name: str) -> Path:
    return home(root) / name


def data(root: Path, name: str) -> Path:
    return Path(root) / DATA / name


def plugin_socket(root: Path, name: str) -> Path:
    return Path("/tmp") / f"journal-{hashlib.sha1(str(data(root, name).resolve()).encode()).hexdigest()[:12]}.sock"


def log(root: Path, name: str) -> Path:
    return Path(root) / "runtime" / LOGS / f"{name}.log"


def logged(root, name: str, line) -> None:
    where = log(root, name)
    where.parent.mkdir(parents=True, exist_ok=True)
    with where.open("a") as f:
        f.write(f"{time.strftime('%H:%M:%S')} {line}\n")


def address(source: str) -> str:
    given = str(source).strip()
    local = Path(given).expanduser()
    if local.exists():
        return str(local.resolve())
    if given.startswith(("http://", "https://", "git@", "file://", "ssh://")):
        return given
    if REPOSITORY.fullmatch(given):
        return f"https://github.com/{given}"
    raise Refused(f"{given!r} is neither a repository URL, an owner/repo, nor a folder on this machine")


def queue_path(root: Path, name: str, env: str = "") -> Path:
    return Path(root) / "runtime" / "plugins" / (f"{name}.{env}.queue" if env else f"{name}.queue")


def values(root: Path, name: str, token: str, ports: dict | None = None, env: str = "") -> dict:
    return {"dir": str(folder(root, name)), "data": str(data(root, name)), "root": str(Path(root)), "project": str(Path(root).parent),
            "journal.url": running(Path(root)) or "", "journal.env": env or default_env(Path(root)), "token": token,
            "queue": str(queue_path(root, name, env)),
            **{f"ports.{service}": port for service, port in (ports or {}).items()}}


def ports_for(root: Path, manifest: Manifest) -> dict:
    from engine.services import allocate
    taken: set[int] = set()
    given = {}
    for service in (service for service in manifest.services if service.port is not None):
        port, blocked = allocate(root, f"{manifest.name}.{service.name}", service.port, taken)
        if port:
            taken.add(port)
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


def chosen_env(manifest: Manifest, chosen: dict | None) -> dict:
    values = chosen_values(manifest, chosen)
    named = {setting.env: values[setting.key] for setting in manifest.settings if setting.env}
    return {**named, "JOURNAL_SETTINGS": json.dumps(values)}


def environment(root: Path, name: str, manifest: Manifest, token: str, ports: dict | None = None, chosen: dict | None = None, env: str = "") -> dict:
    where = values(root, name, token, ports, env)
    given = fill(manifest.env, where)
    path = f"{own_journal(root)}{os.pathsep}{os.environ.get('PATH', '')}"
    return {**os.environ, "PATH": path, **{str(k): str(v) for k, v in given.items()}, **chosen_env(manifest, chosen),
            "JOURNAL_ROOT": where["root"], "JOURNAL_URL": where["journal.url"], "JOURNAL_TOKEN": token,
            "JOURNAL": str(Path(root) / "journal"), "JOURNAL_ENV": where["journal.env"], "JOURNAL_PLUGIN": name,
            "JOURNAL_PLUGIN_DIR": where["dir"], "JOURNAL_PLUGIN_DATA": where["data"], "JOURNAL_QUEUE": where["queue"],
            "JOURNAL_PLUGIN_SOCKET": str(plugin_socket(root, name))}


def run(command, cwd: Path, env: dict, seconds: int) -> tuple[int, str]:
    shell = isinstance(command, str)
    try:
        done = subprocess.run(command if not shell else ["/bin/sh", "-c", command], cwd=cwd, env=env,
                              capture_output=True, text=True, timeout=seconds)
    except (OSError, subprocess.SubprocessError) as error:
        return 1, str(error)
    return done.returncode, f"{done.stdout}{done.stderr}"


def checked(manifest: Manifest, where: Path, env: dict) -> None:
    for wanted in manifest.requires:
        code, out = run(wanted.check, where, env, CHECK_SECONDS)
        if code:
            raise Refused(f"{manifest.name} needs {wanted.tool}: {wanted.hint_text}")


def prepared(manifest: Manifest, where: Path, env: dict, record_log: Path) -> None:
    record_log.parent.mkdir(parents=True, exist_ok=True)
    for step in manifest.setup:
        command = fill(step.run, {k: v for k, v in env.items()})
        with record_log.open("a") as f:
            f.write(f"$ {command_text(command)}\n")
        written = [0]

        def append(output: str) -> None:
            with record_log.open("a") as f:
                f.write(output[written[0]:])
            written[0] = len(output)
        code, out = streamed(command if not isinstance(command, str) else ["/bin/sh", "-c", command], where / step.cwd,
                             SETUP_SECONDS, append, env)
        append(f"{out}\n")
        if code != 0:
            tail = "\n".join(out.strip().splitlines()[-SHOWN_LINES:])
            raise Refused(f"setup step {step.name!r} failed ({code}): {command_text(command)}\n{tail}\nthe whole output is in {record_log}")


@dataclass(frozen=True)
class PreviewRow:
    kind: str
    label: str
    command: str


def preview_rows(manifest: Manifest) -> list[PreviewRow]:
    rows = [PreviewRow("needs", wanted.tool, command_text(wanted.check)) for wanted in manifest.requires]
    rows += [PreviewRow("setup", step.name, command_text(step.run)) for step in manifest.setup]
    rows += [PreviewRow("service", service.name, command_text(service.run)) for service in manifest.services]
    rows += [PreviewRow("on", handler.pattern, handler.command) for handler in manifest.handlers]
    rows += [PreviewRow("refuse", "may refuse a write", command_text(manifest.refuse))] if manifest.refuse else []
    rows += [PreviewRow("page", page.title, f"{page.service}{page.path}") for page in manifest.pages]
    rows += [PreviewRow("setting", setting.key, setting.summary) for setting in manifest.settings]
    return rows


def previewed(manifest: Manifest, source: str, commit: str) -> dict:
    return {"name": manifest.name, "title": f"{manifest.heading} {manifest.version}".strip(),
            "source": source, "commit": commit, "description": manifest.description, "rows": [asdict(row) for row in preview_rows(manifest)]}


def preview(manifest: Manifest, source: str, commit: str) -> str:
    lines = [f"{manifest.heading} {manifest.version}".strip(), f"from {source}" + (f" at {commit[:12]}" if commit else ""), manifest.description, "",
             "It runs as you, with your files and your network. These are its commands:"]
    lines += [f"  {row.kind} {row.label}: {row.command}" for row in preview_rows(manifest)]
    return "\n".join(lines)


def said_version(where: Path, manifest: Manifest) -> str:
    if manifest.version:
        return manifest.version
    kept = Path(where) / "VERSION"
    try:
        return kept.read_text().strip()[:32]
    except OSError:
        return ""


def staged(root: Path, source: str, revision: str, version: str) -> tuple[Path, Manifest, str, bool]:
    where = address(source)
    linked = not where.startswith(("http://", "https://", "git@", "file://", "ssh://"))
    if linked:
        return Path(where), read(Path(where), version), "", True
    staging = home(root) / f".staging-{secrets.token_hex(4)}"
    commit, failed = fetch(staging, where, revision)
    if failed:
        shutil.rmtree(staging, ignore_errors=True)
        raise Refused(f"{where} could not be fetched: {failed}")
    try:
        return staging, read(staging, version), commit, False
    except Refused:
        shutil.rmtree(staging, ignore_errors=True)
        raise


def busy_file(root: Path, name: str) -> Path:
    return Path(root) / "runtime" / f"installing-{name}.lock"


def alone(root: Path, name: str):
    lock = busy_file(root, name)
    lock.parent.mkdir(parents=True, exist_ok=True)
    held = lock.open("w")
    try:
        fcntl.flock(held, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError as error:
        held.close()
        raise Refused(f"{name} is being installed already; wait for that to finish") from error
    return held


def token() -> str:
    return secrets.token_hex(16)
