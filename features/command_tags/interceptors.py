from features.parts import AgentContext, ToolInterceptor
from features.command_tags.reading import REPLIED


class NotifyTagNotUsed(ToolInterceptor):
    behaviour = "replying"

    def intercept(self, context: AgentContext, call) -> str:
        found = REPLIED.search(call.command) if "--file" not in call.command else None
        if found and context.agent:
            context.agent.whisper("by tag", n=found.group(1))
        return ""
