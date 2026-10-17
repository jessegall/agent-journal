from typing import TYPE_CHECKING

from supervisor.inbox import PROTOCOL

if TYPE_CHECKING:
    from supervisor.supervisor import Supervisor

VERBS = ("hello", "keys", "type", "restart", "stop")
"""The verbs this supervisor takes; a later protocol adds verbs and never changes one."""


class Verbs:
    """The protocol's verbs, each a method by its name: a request names one, with what it needs, and gets its answer."""

    def __init__(self, supervisor: "Supervisor") -> None:
        self.supervisor = supervisor

    def handle(self, request: dict) -> dict:
        verb = request.get("verb", "")
        if verb not in VERBS:
            return {"ok": False, "error": f"unknown verb {verb!r}: hello names the verbs this supervisor takes"}
        try:
            return {"ok": True, **getattr(self, verb)(request)}
        except KeyError as missing:
            return {"ok": False, "error": f"{verb} needs {missing}"}
        except LookupError as unknown:
            return {"ok": False, "error": str(unknown)}

    def hello(self, request: dict) -> dict:
        return {"protocol": PROTOCOL, "verbs": list(VERBS)}

    def keys(self, request: dict) -> dict:
        self.supervisor.terminal_named(request["name"]).write(request["keys"].encode())
        return {}

    def type(self, request: dict) -> dict:
        self.supervisor.terminal_named(request["name"]).type(request["line"], float(request.get("after", 0)))
        return {}

    def restart(self, request: dict) -> dict:
        self.supervisor.restart(request["name"], tuple(request.get("resume", ())))
        return {}

    def stop(self, request: dict) -> dict:
        self.supervisor.stop_named(request["name"])
        return {}
