import hashlib
import json
import os
from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.codex.providers.support.codex_hook_event import CodexHookEvent


@dataclass(frozen=True)
class CodexHookDefinition:
    """A command hook's normalized identity, hashed as Codex hashes it for persisted trust."""

    event: CodexHookEvent
    matcher: object
    entry: Mapping[str, object]

    def current_hash(self) -> str | None:
        command = self.entry.get("commandWindows", self.entry.get("command_windows", self.entry.get("command"))) if os.name == "nt" else self.entry.get("command")
        timeout = self.entry.get("timeout", self.event.default_timeout)
        asynchronous = self.entry.get("async", False)
        status = self.entry.get("statusMessage")
        limit = self.entry.get("additionalContextLimit")
        if not isinstance(command, str) or not command.strip() or self.entry.get("type") != "command":
            return None
        if type(timeout) is not int or timeout < 0 or not isinstance(asynchronous, bool):
            return None
        if status is not None and not isinstance(status, str):
            return None
        if limit is not None and (type(limit) is not int or limit < 0):
            return None
        if self.matcher is not None and not isinstance(self.matcher, str):
            return None
        handler: dict[str, object] = {"type": "command", "command": command, "timeout": self.event.timeout(timeout), "async": asynchronous}
        if status is not None:
            handler["statusMessage"] = status
        if self.event.has_context and limit is not None and limit != 2500:
            handler["additionalContextLimit"] = limit
        identity: dict[str, object] = {"event_name": self.event.key, "hooks": [handler]}
        if self.event.has_matcher and self.matcher is not None:
            identity["matcher"] = self.matcher
        body = json.dumps(identity, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()
        return f"sha256:{hashlib.sha256(body).hexdigest()}"
