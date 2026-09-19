import socket
from pathlib import Path

from engine.record import Record
from engine.stored import read_json, write_json

PORTS = range(8440, 8500)
UP, DOWN = "up", "down"


def runtime(root: Path, name: str) -> Path:
    return Path(root) / "runtime" / name


def status_file(root: Path, sid: str) -> Path:
    return runtime(root, f"service-{sid}.json")


def lock_file(root: Path, sid: str) -> Path:
    return runtime(root, f"service-{sid}.lock")


def want_file(root: Path, sid: str) -> Path:
    return runtime(root, f"service-{sid}.want")


def log_file(root: Path, sid: str) -> Path:
    return runtime(root, f"service-{sid}.log")


def status(root: Path, sid: str) -> dict:
    return read_json(status_file(root, sid), {})


def states(root: Path) -> dict:
    home = runtime(root, "")
    found = sorted(home.glob("service-*.json")) if home.is_dir() else []
    return {p.stem.removeprefix("service-"): read_json(p, {}) for p in found}


def wanted(root: Path, sid: str) -> str:
    return str(read_json(want_file(root, sid), {}).get("want") or UP)


def want(root: Path, sid: str, state: str, nonce: float = 0.0) -> dict:
    said = {"want": state if state in (UP, DOWN) else UP, "nonce": nonce or 0.0}
    write_json(want_file(root, sid), said)
    return said


def free(port: int) -> bool:
    with socket.socket() as sock:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            sock.bind(("127.0.0.1", port))
        except OSError:
            return False
    return True


def allocate(root: Path, sid: str, wants, taken: set[int]) -> tuple[int, str]:
    if isinstance(wants, int):
        return (wants, "") if free(wants) or status(root, sid).get("port") == wants else (wants, f"port {wants} is in use")
    before = int(status(root, sid).get("port") or 0)
    if before and before not in taken and free(before):
        return before, ""
    for port in PORTS:
        if port not in taken and free(port):
            return port, ""
    return 0, f"no port free from {PORTS.start} through {PORTS.stop - 1}"


def plugins(root: Path) -> list:
    from controllers.types import Plugins
    from resources.base import SYSTEM
    home = Path(root) / "environments"
    first = sorted(p.name for p in home.iterdir() if p.is_dir()) if home.is_dir() else []
    record = Record(Path(root), first[0] if first else "main")
    return [r for r in Plugins(record, actor=SYSTEM).all() if r.enabled and not r.completed and r.manifest]


def specs(root: Path) -> list[dict]:
    from features.plugins.manifest import fill
    from features.plugins.source import environment, folder
    out: list[dict] = []
    taken: set[int] = set()
    for row in plugins(root):
        name = str(row.manifest.get("name") or "")
        where = folder(root, name)
        env = environment(root, name, row.manifest, row.token)
        ports = {}
        for service, given in (row.manifest.get("services") or {}).items():
            sid = f"{name}.{service}"
            port, blocked = allocate(root, sid, given.get("port"), taken) if given.get("port") is not None else (0, "")
            if port:
                taken.add(port)
                ports[f"ports.{service}"] = port
            out.append({"id": sid, "plugin": name, "service": service, "port": port, "blocked": blocked,
                        "run": given["run"], "cwd": str(where / (given.get("cwd") or "")), "env": {**env, **(given.get("env") or {})},
                        "path": str((given.get("ready") or {}).get("path") or ""), "restart": given.get("restart") or "on-failure",
                        "grace": float(given.get("grace") or 5.0), "show": given.get("show") or {},
                        "lock": str(lock_file(root, sid)), "log": str(log_file(root, sid)), "status": str(status_file(root, sid))})
        for spec in out:
            if spec["plugin"] != name:
                continue
            places = {**ports, "port": spec["port"], "dir": str(where)}
            spec["run"] = fill(spec["run"], places)
            spec["env"] = {key: str(fill(value, places)) for key, value in spec["env"].items()}
            spec["url"] = f"http://127.0.0.1:{spec['port']}" if spec["port"] else ""
    return out
