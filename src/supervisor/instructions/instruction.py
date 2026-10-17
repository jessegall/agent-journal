import json
from dataclasses import dataclass


@dataclass(frozen=True)
class Instruction:
    """One datagram from the journal, as the supervisor acts on it."""

    @classmethod
    def parse(cls, datagram: bytes) -> "Instruction":
        from supervisor.instructions.keys import Keys
        from supervisor.instructions.restart_agent import RestartAgent
        from supervisor.instructions.restart_journal import RestartJournal
        from supervisor.instructions.stop import Stop
        from supervisor.instructions.type import Type
        raw = json.loads(datagram)
        kinds = {"Type": lambda: Type(raw["line"], float(raw.get("after", 0))), "Keys": lambda: Keys(raw["keys"]), "RestartAgent": lambda: RestartAgent(tuple(raw.get("resume", ()))), "RestartJournal": RestartJournal, "Stop": Stop}
        return kinds[raw["type"]]()
