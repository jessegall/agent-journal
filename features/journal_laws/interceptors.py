from features.journal_laws.policy import LAWS, refusal
from features.parts import AgentContext, ToolInterceptor
from features.recital import WHISPER, whisper_due


class EnforceDispatchLaw(ToolInterceptor):
    def intercept(self, context: AgentContext, call) -> str:
        return refusal(context.provider, call)


class WhisperLawOnKeyword(ToolInterceptor):
    behaviour = WHISPER

    def intercept(self, context: AgentContext, call) -> str:
        text = call.text.lower()
        if not text:
            return ""
        for law in LAWS:
            if any(word in text for word in law.keywords) and whisper_due(context, f"law:{law.name}"):
                context.agent.whisper(WHISPER, type="law", n=law.name, title=law.text, brief=law.reason)
        return ""
