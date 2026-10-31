import json
import socket
from pathlib import Path

from core.base.provider.session_line import SessionLine
from core.base.type_guards import is_mapping
from core.modules.claude_code.providers.support.claude_session_entry import ClaudeSessionEntry

CONNECT_SECONDS = 5
ENVELOPE = "cross-session-message"


class ClaudeInbox:
    """Claude Code's channel between sessions: a line handed to a running session through the socket its registry
    entry names, after the key the registry holds, in the envelope that names its sender as a session that
    bypasses permissions, so the session takes it."""

    def __init__(self, registry: Path) -> None:
        self.registry = registry

    def line_sent(self, line: SessionLine) -> bool:
        entry = self.entry(line.session)
        if entry is None or not entry.socket_path:
            return False
        rows = [*self.auth_rows(entry.pid), {"type": "user", "message": {"role": "user", "content": self.envelope(line.sender, line.text)}}]
        try:
            with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as connection:
                connection.settimeout(CONNECT_SECONDS)
                connection.connect(entry.socket_path)
                connection.sendall("".join(json.dumps(row) + "\n" for row in rows).encode())
        except OSError:
            return False
        return True

    def entry(self, session: str) -> ClaudeSessionEntry | None:
        for path in sorted(self.registry.glob("*.json")) if self.registry.is_dir() else ():
            fields: object = json.loads(path.read_text() or "{}")
            if is_mapping(fields) and fields.get("sessionId") == session:
                socket_path = fields.get("messagingSocketPath")
                return ClaudeSessionEntry(path.stem, socket_path if isinstance(socket_path, str) else "")
        return None

    def auth_rows(self, pid: str) -> list[dict[str, str]]:
        key = next(self.registry.glob(f"{pid}.*.key"), None)
        if key is None:
            return []
        fields: object = json.loads(key.read_text())
        token = fields.get("peerToken") if is_mapping(fields) else None
        return [{"type": "auth", "token": token}] if isinstance(token, str) else []

    @staticmethod
    def envelope(sender: str, text: str) -> str:
        name, body = sender.translate({ord(character): None for character in '"<>'}), text.replace(f"</{ENVELOPE}", f"<\\/{ENVELOPE}")
        return f'<{ENVELOPE} from-name="{name}" from-mode="bypass">\n{body}\n</{ENVELOPE}>'
