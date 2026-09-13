from __future__ import annotations

import fmt
from command import Command, Parsed
from controller import Result, dispatch


class Resource(Command):
    """A command that sends what was typed to a resource controller and renders the result."""
    controller = None
    action = ""
    id_arg = "n"

    def extra(self, p: Parsed) -> dict | int:
        """Fields the command adds to what was typed, or the exit code of a refusal."""
        return {}

    def run(self, p: Parsed) -> int:
        from app import root
        extra = self.extra(p)
        if isinstance(extra, int):
            return extra
        return self.render(p, dispatch(root(), self.controller, self.action, p, extra))

    def render(self, p: Parsed, result: Result) -> int:
        if result.message:
            fmt.say(result.message, error=not result.ok)
        return 0 if result.ok else 1
