from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent.tool_starting import ToolStarting
from journal.support.subagent_dispatch import SubagentDispatch

LARGE_LINES = 400


class LawsConduct(Conduct):
    """The laws feature's conduct in every state: a subagent dispatch names its model, one of the project's profiles and a concrete job or is held, and a tool result of many lines is named, since every line stays in the context for good."""

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.laws.feature import Laws
        from journal.features.profiles.feature import Profiles
        dispatch = event.call.operation
        if not isinstance(dispatch, SubagentDispatch):
            return self.none()
        if not dispatch.model:
            return self.refuse(Laws.MISSING_MODEL.create())
        profiles = event.data.part(Profiles)
        if dispatch.role not in profiles.names:
            return self.refuse(Laws.MISSING_PROFILE.create(asked=dispatch.role or "none", profiles=", ".join(profiles.subagents)))
        if not dispatch.title or not dispatch.brief:
            return self.refuse(Laws.UNBOUND_DISPATCH.create())
        return self.none()

    def on_tool_finished(self, event: ToolFinished, settings: Settings) -> Transition:
        from journal.features.laws.feature import Laws
        lines = event.output.count("\n") + 1
        return self.none(Laws.LONG_OUTPUT.create(lines=lines)) if lines >= LARGE_LINES else self.none()
