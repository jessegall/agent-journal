import fcntl
import os
import re
import secrets
import shutil
import subprocess
from pathlib import Path

from engine.hooks import default_env
from engine.viewer import running
from features.plugins.manifest import fill, read
from install import fetch
from resources.base import Refused

HOME = "plugins"
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


def log(root: Path, name: str) -> Path:
    return Path(root) / "runtime" / LOGS / f"{name}.log"


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


def values(root: Path, name: str, token: str, ports: dict | None = None) -> dict:
    return {"dir": str(folder(root, name)), "data": str(data(root, name)), "root": str(Path(root)), "project": str(Path(root).parent),
            "journal.url": running(Path(root)) or "", "journal.env": default_env(Path(root)), "token": token,
            "queue": str(Path(root) / "runtime" / "plugins" / f"{name}.queue"),
            **{f"ports.{service}": port for service, port in (ports or {}).items()}}


def ports_for(root: Path, manifest: dict) -> dict:
    from engine.services import allocate
    name = manifest["name"]
    taken: set[int] = set()
    given = {}
    for service, spec in (manifest.get("services") or {}).items():
        if spec.get("port") is None:
            continue
        port, blocked = allocate(root, f"{name}.{service}", spec["port"], taken)
        if port:
            taken.add(port)
            given[service] = port
    return given


def environment(root: Path, name: str, manifest: dict, token: str, ports: dict | None = None) -> dict:
    where = values(root, name, token, ports)
    given = fill(manifest.get("env") or {}, where)
    return {**os.environ, **{str(k): str(v) for k, v in given.items()},
            "JOURNAL_ROOT": where["root"], "JOURNAL_URL": where["journal.url"], "JOURNAL_TOKEN": token,
            "JOURNAL": str(Path(root) / "journal"), "JOURNAL_ENV": where["journal.env"], "JOURNAL_PLUGIN": name,
            "JOURNAL_PLUGIN_DIR": where["dir"], "JOURNAL_PLUGIN_DATA": where["data"], "JOURNAL_QUEUE": where["queue"]}


def run(command, cwd: Path, env: dict, seconds: int) -> tuple[int, str]:
    shell = isinstance(command, str)
    try:
        done = subprocess.run(command if not shell else ["/bin/sh", "-c", command], cwd=cwd, env=env,
                              capture_output=True, text=True, timeout=seconds)
    except (OSError, subprocess.SubprocessError) as error:
        return 1, str(error)
    return done.returncode, f"{done.stdout}{done.stderr}"


def command_text(command) -> str:
    return command if isinstance(command, str) else " ".join(command)


def checked(manifest: dict, where: Path, env: dict) -> None:
    for tool, wanted in (manifest.get("requires") or {}).items():
        code, out = run(wanted["check"], where, env, CHECK_SECONDS)
        if code:
            raise Refused(f"{manifest['name']} needs {tool}: {wanted.get('hint') or command_text(wanted['check'])}")


def prepared(manifest: dict, where: Path, env: dict, record_log: Path) -> None:
    record_log.parent.mkdir(parents=True, exist_ok=True)
    for step in manifest.get("setup") or []:
        command = fill(step["run"], {k: v for k, v in env.items()})
        code, out = run(command, where / (step["cwd"] or ""), env, SETUP_SECONDS)
        with record_log.open("a") as f:
            f.write(f"$ {command_text(command)}\n{out}\n")
        if code:
            tail = "\n".join(out.strip().splitlines()[-SHOWN_LINES:])
            raise Refused(f"setup step {step['name']!r} failed ({code}): {command_text(command)}\n{tail}\nthe whole output is in {record_log}")


def previewed(manifest: dict, source: str, commit: str) -> dict:
    name = manifest["name"]
    rows = [{"kind": "needs", "label": tool, "command": command_text(wanted["check"])} for tool, wanted in (manifest.get("requires") or {}).items()]
    rows += [{"kind": "setup", "label": step["name"], "command": command_text(step["run"])} for step in manifest.get("setup") or []]
    rows += [{"kind": "service", "label": service, "command": command_text(spec["run"])} for service, spec in (manifest.get("services") or {}).items()]
    rows += [{"kind": "on", "label": pattern, "command": handler.get("post") or command_text(handler.get("run"))} for pattern, handler in (manifest.get("on") or {}).items()]
    rows += [{"kind": "refuse", "label": "may refuse a write", "command": command_text(manifest["refuse"])}] if manifest.get("refuse") else []
    rows += [{"kind": "page", "label": page["title"], "command": f"{page['service']}{page['path']}"} for page in manifest.get("pages") or []]
    rows += [{"kind": "setting", "label": key, "command": f"reads {setting['env']}" if setting.get("env") else str(setting.get("title") or key)}
             for key, setting in (manifest.get("settings") or {}).items()]
    return {"name": name, "title": f"{manifest.get('title') or name} {manifest.get('version') or ''}".strip(),
            "source": source, "commit": commit, "description": manifest.get("description") or "", "rows": rows}


def preview(manifest: dict, source: str, commit: str) -> str:
    shown = previewed(manifest, source, commit)
    lines = [shown["title"], f"from {source}" + (f" at {commit[:12]}" if commit else ""), shown["description"], "",
             "It runs as you, with your files and your network. These are its commands:"]
    lines += [f"  {row['kind']} {row['label']}: {row['command']}" for row in shown["rows"]]
    return "\n".join(lines)


def said_version(where: Path, manifest: dict) -> str:
    given = str(manifest.get("version") or "")
    if given:
        return given
    kept = Path(where) / "VERSION"
    try:
        return kept.read_text().strip()[:32]
    except OSError:
        return ""


def staged(root: Path, source: str, revision: str, version: str) -> tuple[Path, dict, str, bool]:
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
    except BlockingIOError:
        held.close()
        raise Refused(f"{name} is being installed already; wait for that to finish")
    return held


def token() -> str:
    return secrets.token_hex(16)
