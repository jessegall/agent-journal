import re

from events import Fact
from events.agents import AgentMessageSent
from events.row_links import AmbiguousFileNamed
from features.row_links.paths import EXT, a_file
from receiving import Listener
from serving import ReadFiles

NAME = re.compile(rf"(?<![\w./-])([\w.-]+\.(?:{EXT}))(?![\w/-])")
SHOWN = 5


class SpotAmbiguousFiles(Listener[AgentMessageSent]):
    def listen(self, event: AgentMessageSent, files: ReadFiles) -> list[Fact]:
        found = []
        for name in dict.fromkeys(m.group(1) for m in NAME.finditer(event.text)):
            matches = files.matching(name) if a_file(name) else []
            if len(matches) > 1:
                found.append(AmbiguousFileNamed(name=name, count=len(matches), paths=", ".join(matches[:SHOWN])).once(f"ambiguous|{event.agent}|{name}"))
        return found
