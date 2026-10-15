import json
import os
import socket


MARK = "[journal]"


class SupervisorLink:
    """The journal's end of the supervisor's inbox: one datagram per instruction, nothing read back. The supervisor names the socket in JOURNAL_INBOX; with none set, every call is a no-op. Every line typed starts with the mark, so the agent can tell the journal from the user."""

    def __init__(self) -> None:
        self.path = os.environ.get("JOURNAL_INBOX", "")

    def type(self, line: str) -> None:
        self._send({"type": "Type", "line": f"{MARK} {line}"})

    def restart_agent(self, resume: tuple[str, ...]) -> None:
        self._send({"type": "RestartAgent", "resume": list(resume)})

    def restart_journal(self) -> None:
        self._send({"type": "RestartJournal"})

    def stop(self) -> None:
        self._send({"type": "Stop"})

    def _send(self, instruction: dict) -> None:
        if not self.path:
            return
        with socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM) as out:
            out.sendto(json.dumps(instruction).encode(), self.path)
