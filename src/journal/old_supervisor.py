from pathlib import Path

OLD = {
    "type": lambda request: {"type": "Type", "line": request["line"], "after": request.get("after", 0.0)},
    "keys": lambda request: {"type": "Keys", "keys": request["keys"]},
    "restart": lambda request: {"type": "RestartAgent", "resume": request.get("resume", [])} if request["name"] == "agent" else {"type": "RestartJournal"},
    "stop": lambda request: {"type": "Stop"},
}
"""Each verb as the datagram a supervisor from before the protocol took."""


class OldSupervisor:
    """A supervisor from before the protocol, announced by a bare path: a request said as the datagram it took, nothing read back. It goes once the one restart has moved every session onto the protocol."""

    @staticmethod
    def screen(home: Path, environment: str) -> str:
        """Where a supervisor from before the protocol mirrors its agent's screen, which it does not announce."""
        return str(home / "runtime" / "screens" / f"{environment}.out")

    @staticmethod
    def takes(request: dict) -> bool:
        return request.get("verb") in OLD

    @staticmethod
    def datagram(request: dict) -> dict:
        return OLD[request["verb"]](request)
