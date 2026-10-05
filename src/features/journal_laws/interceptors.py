import re
from pathlib import Path

from features.journal_laws.laws import cartoon_names, laws, refusal
from engine.events.engine import AgentMessageSent
from engine.gates import DISPATCHING
from features.parts import AgentContext, Canceler, Handler, ToolInterceptor
from features.recital import COMMANDS, WHISPER, mentioned, searched, whisper_due
from providers.payload import ReadCall
from resources.types import TYPES
from engine.reach import Reach
from controllers.types import Agents


class EnforceDispatchLaw(Canceler):
    reach = Reach.MAIN
    event = DISPATCHING

    def cancel(self, context: AgentContext, data) -> str:
        return refusal(data, cartoon_names(context.record))


class WhisperLawOnKeyword(ToolInterceptor):
    reach = Reach.MAIN
    behaviour = WHISPER
    refuses = False

    def intercept(self, context: AgentContext, call) -> str:
        whisper_laws(context, lambda scope: searched(call, scope))
        return ""


class WhisperLawInChat(Handler):
    def handle(self, context: AgentContext, event: AgentMessageSent) -> None:
        if context.on(WHISPER):
            whisper_laws(context, lambda scope: "" if scope == COMMANDS else event.text)


def whisper_laws(context: AgentContext, text_of) -> None:
    for law in laws(context.record):
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
    reach = Reach.MAIN
    def intercept(self, context: AgentContext, call) -> str:
        shell = call.shell_command
        cat = CAT.search(shell) if shell else None
        whole = isinstance(call, ReadCall) and call.whole
        printed = cat.group(1) if cat else ""
        named = call.file_path if whole else printed
        if not named:
            return ""
        path = Path(named).expanduser()
        path = path if path.is_absolute() else Path(context.hook.cwd or context.record.root.parent) / path
        if any(path.is_relative_to(context.record.folder(kind.type, kind.scope)) for kind in TYPES.values() if kind.read_whole):
            return ""
        count, limit = lines_in(path), int(context.settings.whole_read_lines)
        if count <= limit:
            return ""
        instead = "read a range (offset 1, limit 120)" if whole else f"print a range: sed -n '1,120p' {named}"
        context.journal.get(Agents).card(context.agent.row.n, label=f"Refused reading a long file whole `{path}`", icon="terminal", tone="danger",
                                    title=f"{count:,} lines; told to {instead} or grep instead")
        return (f"{named} has {count:,} lines, too long to read whole (law L3, read narrowly). Instead: {instead}, then the next range; "
                f"or list its headings first with grep -n '^#' {named} and read only the part you need; or grep -n for the line you want.")
