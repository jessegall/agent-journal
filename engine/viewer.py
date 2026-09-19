import json
import os
import re
import socket
import subprocess
import sys
import time
import webbrowser
from pathlib import Path
from urllib.request import urlopen

PORTS = range(8420, 8440)
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
    url = f"http://127.0.0.1:{port}/"
    target = marker(root)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps({"url": url, "at": time.time()}))
    note(root, url)
    return url


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


def running(root: Path) -> str:
    want = root.resolve()
    for url in candidates(root):
        try:
            with urlopen(f"{url}api/identity", timeout=0.05) as response:
                if Path(str(json.loads(response.read()).get("root") or "")).resolve() == want:
                    return url
        except (OSError, ValueError):
            continue
    return ""


def available() -> int:
    for port in PORTS:
        with socket.socket() as sock:
            try:
                sock.bind(("127.0.0.1", port))
            except OSError:
                continue
            return port
    raise OSError("no viewer port available from 8420 through 8439")


def start(root: Path, project: Path) -> str:
    already = running(root)
    if already:
        return already
    port = available()
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


def ensure(root: Path, project: Path, opener=webbrowser.open) -> str:
    url = start(root, project)
    if url:
        opener(url)
    return url
