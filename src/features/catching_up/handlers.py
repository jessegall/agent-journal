from engine.events.agents import AgentReported
from features.parts import AgentContext, Handler
from providers.payload import HookEvent


class HoldUntilCaughtUp(Handler):
    hooks = (HookEvent.PRE_COMPACT,)

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        context.hold("read held", count=context.settings.count)
