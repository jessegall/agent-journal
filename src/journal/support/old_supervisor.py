from pathlib import Path

OLD = {
    "type": lambda request: {"type": "Type", "line": request["line"], "after": request.get("after", 0.0)},
    "keys": lambda request: {"type": "Keys", "keys": request["keys"]},
    "restart": lambda request: {"type": "RestartAgent", "resume": request.get("resume", [])} if request["name"] == "agent" else {"type": "RestartJournal"},
}
"""Each verb as the datagram a datagram supervisor takes."""


class OldSupervisor:
    """A supervisor that takes datagrams, announced by a bare path: a request said as the datagram it takes, nothing read back."""

    @staticmethod
    def screen(home: Path, environment: str) -> str:
        """Where a datagram supervisor mirrors its agent's screen, which it does not announce."""
        return str(home / "runtime" / "screens" / f"{environment}.out")

    @staticmethod
    def takes(verb: str) -> bool:
        return verb in OLD

    @staticmethod
    def datagram(verb: str, fields: dict) -> dict:
        return OLD[verb](fields)
