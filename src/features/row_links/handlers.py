import re

from engine.events import AgentMessageSent
from engine.project_files import matching
from features.parts import AgentContext, Handler
from features.row_links.details import AMBIGUOUS
from features.row_links.formatters import EXT, a_file

NAME = re.compile(rf"(?<![\w./-])([\w.-]+\.(?:{EXT}))(?![\w/-])")


class NameAmbiguousFiles(Handler):
    def handle(self, context: AgentContext, event: AgentMessageSent) -> None:
        told = set(context.state.get("ambiguous", []))
        project = context.record.root.parent
        for name in dict.fromkeys(m.group(1) for m in NAME.finditer(event.text)):
            found = matching(project, name) if a_file(name) and name not in told else []
            if len(found) > 1:
                told.add(name)
                context.agent.whisper(AMBIGUOUS, name=name, count=len(found), paths=", ".join(found[:5]))
        context.state.set("ambiguous", sorted(told))
