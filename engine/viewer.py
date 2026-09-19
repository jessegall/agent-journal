import json
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


def marker(root: Path) -> Path:
    return root / "runtime" / "viewer.json"


def remember(root: Path, port: int) -> str:
    url = f"http://127.0.0.1:{port}/"
    target = marker(root)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps({"url": url, "at": time.time()}))
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
