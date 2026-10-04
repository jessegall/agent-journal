import json
import getpass
import re
import socket
from pathlib import Path

from engine.viewer import known
from engine.proc import git

EMAIL = re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)*\.[A-Za-z]{2,}\b")
SESSION = re.compile(r"\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b")
TUNNEL = re.compile(r"[\w.-]*(?:tunler|trycloudflare|ngrok)[\w.-]*\.[a-z]{2,}", re.IGNORECASE)
KEPT_EMAIL = "demo@example.com"
HOME = "/home/demo"
PROJECT = "/home/demo/project"
SHORTEST_NAME = 4
NAMED = re.compile(r"[-_\d]|^\w{10,}$")
WORDS = "/usr/share/dict/words"


def dictionary() -> frozenset:
    try:
        return frozenset(Path(WORDS).read_text(errors="ignore").lower().split())
    except OSError:
        return frozenset()


def word(name: str) -> bool:
    lowered = name.lower()
    return not DICTIONARY or lowered in DICTIONARY or lowered.removesuffix("s") in DICTIONARY


def private(name: str) -> bool:
    return len(name) >= SHORTEST_NAME and not name.startswith("tmp") and not TUNNEL.search(f"{name}.com") and (bool(NAMED.search(name)) or not word(name))



DICTIONARY = dictionary()

class Scrubber:
    def __init__(self, folders: list[str] | None = None):
        self.sessions: dict[str, str] = {}
        self.paths = {str(Path.home()): HOME, **dict.fromkeys(folders or [], PROJECT)}
        git_name = git(["config", "user.name"], Path(folders[0]) if folders else Path.cwd()).strip()
        self.names = {name: "demo" for name in (getpass.getuser(), Path.home().name) if len(name) >= SHORTEST_NAME}
        self.names.update({name: "demo" for name in (git_name, *git_name.split()) if name})
        self.names.update({name: "demo" for journal in known() for name in (journal.project, Path(journal.root).parent.name) if private(name)})
        host = socket.gethostname().split(".")[0]
        if len(host) >= SHORTEST_NAME:
            self.names[host] = "demo-host"

    def text(self, raw: str) -> str:
        for path in sorted(self.paths, key=len, reverse=True):
            raw = raw.replace(path, self.paths[path])
        raw = TUNNEL.sub("demo.example.com", raw)
        raw = EMAIL.sub(KEPT_EMAIL, raw)
        raw = SESSION.sub(lambda found: self.sessions.setdefault(found.group(), f"session-{len(self.sessions) + 1:04d}"), raw)
        for name in sorted(self.names, key=len, reverse=True):
            raw = re.sub(rf"\b{re.escape(name)}\b", self.names[name], raw)
        return raw

    def leaks(self, raw: str) -> list[str]:
        found = [path for path in self.paths if path in raw]
        found += [name for name in self.names if re.search(rf"\b{re.escape(name)}\b", raw)]
        found += TUNNEL.findall(raw)
        found += [email for email in EMAIL.findall(raw) if email != KEPT_EMAIL]
        found += SESSION.findall(raw)
        try:
            data = json.loads(raw)
        except ValueError:
            data = {}
        answers = data.get("answers", {}) if isinstance(data, dict) else {}
        for answer in (data, *(answers.values() if isinstance(answers, dict) else ())):
            if not isinstance(answer, dict) or not isinstance(answer.get("places"), list) or not isinstance(answer.get("at"), str):
                continue
            found.extend(name for place in answer["places"] if isinstance(place, dict) and isinstance(place.get("root"), str)
                         and place["root"] != answer["at"] for name in (place["project"], Path(place["root"]).parent.name))
        return sorted(set(found))
