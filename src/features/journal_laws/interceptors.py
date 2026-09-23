import re
from pathlib import Path

from features.journal_laws.policy import LAWS, refusal
from engine.events import AgentMessageSent
from engine.hooks import DISPATCHING
from features.parts import AgentContext, Canceler, Handler, ToolInterceptor
from features.recital import COMMANDS, WHISPER, mentioned, searched, whisper_due
from providers.payload import ReadCall
from resources.types import TYPES


class EnforceDispatchLaw(Canceler):
    event = DISPATCHING

    def cancel(self, context: AgentContext, data) -> str:
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
            context.agent.whisper(WHISPER, type="law", n=law.name, title=law.text, brief=law.reason)


PAGED = (".pdf", ".ipynb")
CAT = re.compile(r"(?:^|[;&|]\s*)cat\s+([^\s|;&<>-][^\s|;&<>]*)\s*(?=$|[;&])")


def lines_in(path: Path) -> int:
    if path.suffix.lower() in PAGED:
        return 0
    try:
        with path.open("rb") as f:
            first = f.read(1 << 16)
            return 0 if b"\0" in first else first.count(b"\n") + sum(chunk.count(b"\n") for chunk in iter(lambda: f.read(1 << 16), b""))
    except OSError:
        return 0


class RefuseWholeLongReads(ToolInterceptor):
    def intercept(self, context: AgentContext, call) -> str:
        shell = context.provider.shell_command(call)
        cat = CAT.search(shell) if shell else None
        whole = isinstance(call, ReadCall) and call.whole
        named = call.file_path if whole else cat.group(1) if cat else ""
        if not named:
            return ""
        path = Path(named).expanduser()
        path = path if path.is_absolute() else Path(context.hook.cwd or context.record.root.parent) / path
        if any(path.is_relative_to(context.record.folder(kind.type, kind.scope)) for kind in TYPES.values() if kind.read_whole):
            return ""
        count, limit = lines_in(path), int(context.settings.whole_read_lines)
        if count <= limit:
            return ""
        instead = "read a range (offset and limit)" if whole else "print a range with sed -n"
        context.journal.agents.card(context.agent.row.n, label=f"Refused reading a long file whole `{path}`", icon="terminal", tone="danger",
                                    title=f"{count:,} lines; told to {instead} or grep instead")
        return f"{named} has {count:,} lines: {instead}, or grep for what you need first (law L3, read narrowly)"
