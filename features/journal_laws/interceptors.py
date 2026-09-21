from features.journal_laws.policy import LAWS, refusal
from features.parts import Context, ToolInterceptor
from features.recital import WHISPER, whisper_due


class EnforceDispatchLaw(ToolInterceptor):
    def intercept(self, context: Context, call) -> str:
        return refusal(context.provider, call)


class WhisperLawOnKeyword(ToolInterceptor):
    behaviour = WHISPER

    def intercept(self, context: Context, call) -> str:
        text = call.said.lower()
        if not text or not context.agent:
            return ""
        for law in LAWS:
            if any(word in text for word in law.keywords) and whisper_due(context, f"law:{law.name}"):
                context.agent.whisper(WHISPER, type="law", n=law.name, title=law.text, brief=law.reason)
        return ""
