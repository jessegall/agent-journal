from __future__ import annotations

import fmt
from command import Command, Parsed
from controller import Payload, Result


class Resource(Command):
    """A command that hands its payload to a resource controller and renders the result."""
    controller = None
    action = ""
    id_arg = "n"

    def payload(self, p: Parsed) -> Payload | int:
        return p.payload()

    def run(self, p: Parsed) -> int:
        from app import root
        payload = self.payload(p)
        if isinstance(payload, int):
            return payload
        return self.render(p, self.controller.call(root(), self.action, payload))

    def render(self, p: Parsed, result: Result) -> int:
        if result.message:
            fmt.say(result.message, error=not result.ok)
        return 0 if result.ok else 1
