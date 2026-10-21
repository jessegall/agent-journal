from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent.tool_starting import ToolStarting
from journal.support.dispatch_tools import DISPATCH_TOOLS

LARGE = 400


class LawsConduct(Conduct):
    """The laws feature's conduct in every state: a subagent dispatch names its model, one of the project's profiles and a concrete job or is held, and a tool result of many lines is named, since every line stays in the context for good."""

    def on_tool_starting_laws(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.laws.feature import Laws
        from journal.features.profiles.feature import Profiles
        if event.call.tool not in DISPATCH_TOOLS:
            return self.unchanged()
        if not event.call.input.get("model"):
            return self.hold(Laws.NAME_THE_MODEL.create())
        profiles = event.data.of(Profiles)
        asked = event.call.input.get("subagent_type", "")
        if asked not in profiles.names:
            return self.hold(Laws.NAME_A_PROFILE.create(asked=asked or "none", profiles=", ".join(profiles.subagents)))
        if not event.call.input.get("description") or not event.call.input.get("prompt"):
            return self.hold(Laws.BIND_THE_JOB.create())
        return self.unchanged()

    def on_tool_finished_laws(self, event: ToolFinished, settings: Settings) -> Transition:
        from journal.features.laws.feature import Laws
        lines = event.output.count("\n") + 1
        return self.unchanged(Laws.CAP_THE_OUTPUT.create(lines=lines)) if lines >= LARGE else self.unchanged()
