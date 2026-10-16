"""The replay harness of plan 2: the same scripted steps run on two fresh journals, one with a listener and one with the workflow
that replaces it, and what the agent would have seen is compared step by step: the hook's answer, the lines typed to its terminal,
and, when asked, the keys of the nudges said. A record can be frozen to a file, so the comparison survives the listener's deletion."""

import json
from dataclasses import dataclass
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request as HttpRequest, urlopen

from journal.models.actor import Actor
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments
from journal.repositories.settings import Settings
from journal.supervisor_link import SupervisorLink

RECORDS = Path(__file__).with_name("replays")


@dataclass(frozen=True)
class Tools:
    """The names a provider's agent uses for reading, writing and the shell."""

    read: str
    write: str
    shell: str


TOOLS = {"claude": Tools("Read", "Write", "Bash"), "codex": Tools("read_file", "write_file", "Bash")}
PROVIDERS = tuple(TOOLS)


def hook_as(app, provider: str, kind: str, **body):
    """A hook as the provider's agent sends it: the status and the answer."""
    data = json.dumps({"hook_event_name": kind, "session_id": "s1", **body}).encode()
    request = HttpRequest(f"http://127.0.0.1:{app.server().port}/hooks/{provider}", data=data, method="POST", headers={"Content-Type": "application/json"})
    try:
        with urlopen(request, timeout=5) as reply:
            return reply.status, json.loads(reply.read())
    except HTTPError as error:
        return error.code, json.loads(error.read())


class Replay:
    """One journal under replay: the lines typed to its agent are caught, and each step closes with what the step answered, typed and said."""

    def __init__(self, app, monkeypatch, listeners_off: tuple[str, ...] = ()) -> None:
        """On a started journal: the listeners named are off and every other on, whatever the shipped workflows switched off at boot."""
        self.app, self.typed, self.steps, self.seen = app, [], [], 0
        monkeypatch.setattr(SupervisorLink, "_send", lambda link, environment_id, instruction: self.typed.append(instruction["line"]))
        app.container.get(Settings).set("listeners.off", list(listeners_off), Actor.system())

    def step(self, name: str, answer=None) -> None:
        """Closes a step: the hook's answer when the step was a hook, the lines typed since the last step, and the nudges said since."""
        environment = self.app.container.get(Environments).named("main").id
        nudges = [e.data["key"] for e in reversed(self.app.container.get(Entries).of_kind_in(environment, 1000)) if e.kind == "nudge"]
        self.steps.append({"name": name, "answer": answer, "typed": list(self.typed), "nudges": nudges[self.seen:]})
        self.seen = len(nudges)
        self.typed.clear()

    def record(self) -> list[dict]:
        return list(self.steps)

    def freeze(self, name: str) -> Path:
        RECORDS.mkdir(exist_ok=True)
        path = RECORDS / f"{name}.json"
        path.write_text(json.dumps(self.record(), indent=2) + "\n")
        return path

    @staticmethod
    def frozen(name: str) -> list[dict]:
        return json.loads((RECORDS / f"{name}.json").read_text())


def differences(left: list[dict], right: list[dict], nudges: bool = False) -> list[str]:
    """What differs between two records, step by step, in words; nothing when the agent would have seen the same."""
    found = []
    for a, b in zip(left, right):
        if a["answer"] != b["answer"]:
            found.append(f"{a['name']}: the hook's answer differs: {a['answer']} against {b['answer']}")
        if a["typed"] != b["typed"]:
            found.append(f"{a['name']}: the lines typed differ: {a['typed']} against {b['typed']}")
        if nudges and a["nudges"] != b["nudges"]:
            found.append(f"{a['name']}: the nudges said differ: {a['nudges']} against {b['nudges']}")
    if len(left) != len(right):
        found.append(f"{len(left)} steps against {len(right)}")
    return found
