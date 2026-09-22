from engine.events import AgentUpdated
from features.runtime_cleanup.tidy import tidy
from features.parts import WHOLE_FEATURE, AgentContext, Handler


class TidyRuntime(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: AgentContext, event: AgentUpdated) -> None:
        tidy(context.record.root, context.settings.days)
