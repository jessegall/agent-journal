from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent_listener import AgentListener
from journal.support.decision import Decision
from journal.features.laws.listeners.judge_dispatch import DISPATCH_TOOLS
from journal.features.profiles.profile_files import ProfileFiles


class RefuseWorkerAsSubagent(AgentListener[ToolStarting]):
    """A worker profile writes, so naming it as a subagent is refused and the worker dispatch is said."""

    blocking = True

    def __init__(self, files: ProfileFiles) -> None:
        self.files = files

    def handle(self, event: ToolStarting) -> Decision | None:
        name = event.input.get("subagent_type", "")
        if event.tool not in DISPATCH_TOOLS or not name or self.files.kind_of(name) != "worker":
            return None
        return Decision.refuse(f"{name} is a worker profile: it writes, so dispatch it with journal worker dispatch {name} \"<job>\" --model <model>, not as a subagent")
