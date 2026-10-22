from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.tool_starting import ToolStarting
from journal.support.subagent_dispatch import SubagentDispatch


class ProfilesConduct(Conduct):
    """The profiles feature's conduct in every state: a worker profile writes, so naming it as a subagent is held and the worker dispatch said."""

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.profiles.feature import Profiles
        dispatch = event.call.operation
        if not isinstance(dispatch, SubagentDispatch) or dispatch.role not in event.data.part(Profiles).workers:
            return self.none()
        return self.refuse(Profiles.WORKER_PROFILE_MISUSE.create(name=dispatch.role))
