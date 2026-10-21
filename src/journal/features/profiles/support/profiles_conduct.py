from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.tool_starting import ToolStarting
from journal.support.dispatch_tools import DISPATCH_TOOLS


class ProfilesConduct(Conduct):
    """The profiles feature's conduct in every state: a worker profile writes, so naming it as a subagent is held and the worker dispatch said."""

    def on_tool_starting_profiles(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.profiles.feature import Profiles
        name = event.input.get("subagent_type", "")
        if event.tool not in DISPATCH_TOOLS or name not in event.snapshot.of(Profiles).workers:
            return self.unchanged()
        return self.hold(Profiles.WORKER_PROFILE_IS_NOT_A_SUBAGENT.create(name=name))
