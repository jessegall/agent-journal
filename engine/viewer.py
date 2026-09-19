import json
import os
import re
import signal
import socket
import subprocess
import sys
import threading
import time
import webbrowser
from pathlib import Path
from urllib.request import urlopen

from features.tabfocus.focus import existing_tab

PORTS = range(8420, 8440)
HEARTBEAT = 2.0
URL = re.compile(r"http://127\.0\.0\.1:\d+/")


def machine() -> Path:
    return Path(os.environ.get("AGENT_JOURNAL_HOME") or Path.home() / ".journal") / "journals.json"


def marker(root: Path) -> Path:
    return root / "runtime" / "viewer.json"


def known() -> list[dict]:
    try:
        return [j for j in json.loads(machine().read_text()) if isinstance(j, dict) and j.get("root")]
    except (OSError, ValueError):
        return []


def keep(entries: list[dict]) -> None:
    target = machine()
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(sorted(entries, key=lambda j: -j["at"])))


def note(root: Path, url: str) -> None:
    root = root.resolve()
    keep([*(j for j in known() if j["root"] != str(root)), {"root": str(root), "project": root.parent.name, "url": url, "at": time.time()}])


def forget(root: str) -> None:
    keep([j for j in known() if j["root"] != root])


def remember(root: Path, port: int) -> str:
    url = beat(root, port)
    note(root, url)
    return url


def beat(root: Path, port: int) -> str:
    url = f"http://127.0.0.1:{port}/"
    for target, text in ((marker(root), json.dumps({"url": url, "at": time.time(), "port": port, "pid": os.getpid()})), (root / "runtime" / "heartbeat", f"{int(time.time())} {url}\n")):
        target.parent.mkdir(parents=True, exist_ok=True)
        partial = target.with_name(f".{target.name}.partial")
        partial.write_text(text)
        partial.replace(target)
    return url


def heartbeat(root: Path, port: int, every: float = HEARTBEAT) -> None:
    def keep() -> None:
        while True:
            time.sleep(every)
            beat(root, port)
    threading.Thread(target=keep, daemon=True).start()


def candidates(root: Path) -> list[str]:
    found = []
    try:
        found.append(str(json.loads(marker(root).read_text()).get("url") or ""))
    except (OSError, ValueError):
        pass
    try:
        found.extend(URL.findall((root / "runtime" / "viewer.log").read_text())[-1:])
    except OSError:
        pass
    found.extend(f"http://127.0.0.1:{port}/" for port in PORTS)
    return list(dict.fromkeys(url for url in found if url))


def answers(url: str, root: Path, timeout: float = 0.05) -> bool:
    try:
        with urlopen(f"{url}api/identity", timeout=timeout) as response:
            return Path(str(json.loads(response.read()).get("root") or "")).resolve() == root.resolve()
    except (OSError, ValueError):
        return False


def running(root: Path) -> str:
    return next((url for url in candidates(root) if answers(url, root)), "")


def marked(root: Path) -> str:
    url = candidates(root)[:1]
    return url[0] if url and answers(url[0], root, timeout=0.2) else ""


def available(prefer: int = 0) -> int:
    for port in ([prefer] if prefer in PORTS else []) + list(PORTS):
        with socket.socket() as sock:
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                sock.bind(("127.0.0.1", port))
            except OSError:
                continue
            return port
    raise OSError("no viewer port available from 8420 through 8439")


def last(root: Path) -> dict:
    try:
        return json.loads(marker(root).read_text())
    except (OSError, ValueError):
        return {}


def restart(root: Path, project: Path) -> str:
    was = last(root)
    if was.get("pid") and running(root):
        os.kill(int(was["pid"]), signal.SIGTERM)
        for _ in range(50):
            if not running(root):
                break
            time.sleep(0.1)
    return start(root, project)


def start(root: Path, project: Path) -> str:
    already = running(root)
    if already:
        return already
    port = available(last(root).get("port", 0))
    log = root / "runtime" / "viewer.log"
    log.parent.mkdir(parents=True, exist_ok=True)
    command = [sys.executable, str(Path(__file__).resolve().parents[1] / "journal.py"), "--root", str(root), "serve", "--port", str(port)]
    with log.open("a") as output:
        subprocess.Popen(command, cwd=project, stdin=subprocess.DEVNULL, stdout=output, stderr=output, start_new_session=True)
    for _ in range(60):
        time.sleep(0.1)
        url = running(root)
        if url:
            return url
    return ""


def show(url: str, opener=webbrowser.open, focuser=existing_tab) -> str:
    if url and not focuser(url):
        opener(url)
    return url


def ensure(root: Path, project: Path, opener=webbrowser.open, focuser=existing_tab) -> str:
    return show(start(root, project), opener, focuser)
