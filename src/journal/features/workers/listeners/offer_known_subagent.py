from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent_listener import AgentListener
from journal.support.decision import Decision
from journal.features.workers.named_paths import NamedPaths
from journal.features.workers.subagents import Subagents

FRESH = ("auditor", "reviewer", "plan-reviewer", "critic", "goal-verifier")
"""Kinds whose job is a fresh look, never handed to one that already formed a view."""


class OfferKnownSubagent(AgentListener[ToolStarting]):
    """A new subagent whose job names files a finished one of the same kind already worked on is refused, naming that one with the line that gives it the job; a review is always fresh."""

    blocking = True

    def __init__(self, subagents: Subagents) -> None:
        self.subagents = subagents

    def handle(self, event: ToolStarting) -> Decision | None:
        given = event.input if event.tool in ("Agent", "Task") else {}
        kind = given.get("subagent_type", "")
        named = NamedPaths.of(f"{given.get('description', '')} {given.get('prompt', '')}")
        if not named or kind in FRESH:
            return None
        known = next((row for row in reversed(self.subagents.rows(event.session)) if not row.running and row.session and row.type == kind and named & NamedPaths.of(row.brief)), None)
        if known is None:
            return None
        return Decision.refuse(f"subagent {known.session} ({known.task}) already worked on the files this job names: send it the job with SendMessage({{to: \"{known.session}\", message: \"<job>\"}}), so it goes on with what it knows")
