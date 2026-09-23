from features.journal_laws.policy import LAWS, refusal
from engine.events import AgentMessageSent
from engine.hooks import DISPATCHING
from features.parts import AgentContext, Canceler, Handler, ToolInterceptor
from features.recital import COMMANDS, WHISPER, mentioned, searched, whisper_due


class EnforceDispatchLaw(Canceler):
    event = DISPATCHING

    def cancel(self, context: AgentContext, data: dict) -> str:
        return refusal(data)


class WhisperLawOnKeyword(ToolInterceptor):
    behaviour = WHISPER

    def intercept(self, context: AgentContext, call) -> str:
        whisper_laws(context, lambda scope: searched(call, scope))
        return ""


class WhisperLawInChat(Handler):
    def handle(self, context: AgentContext, event: AgentMessageSent) -> None:
        if context.on(WHISPER):
            whisper_laws(context, lambda scope: "" if scope == COMMANDS else event.text)


def whisper_laws(context: AgentContext, text_of) -> None:
    for law in LAWS:
        if mentioned(law.keywords, text_of(law.keywords_in)) and whisper_due(context, f"law:{law.name}"):
            context.agent.whisper(WHISPER, type="law", n=law.name, title=law.text)
