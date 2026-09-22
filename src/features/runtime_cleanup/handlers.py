from engine.events import ClockTicked
from features.runtime_cleanup.tidy import tidy
from features.parts import WHOLE_FEATURE, AgentContext, Handler


class TidyRuntime(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        tidy(context.record.root, context.settings.days)
