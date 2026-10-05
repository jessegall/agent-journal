import re

from engine.events.engine import AgentMessageSent
from features.parts import AgentContext, Handler
from features.pinned_links.details import UNPINNED
from controllers.types import Notices

LINK = re.compile(r"https?://[^\s<>()\[\]\"'`]+")
SELF_PINNED = re.compile(r"^https?://(?:localhost|127\.0\.0\.1)[:/]|^https://github\.com/[^/]+/[^/]+/pull/\d+")


class RemindToPinLinks(Handler):
    def handle(self, context: AgentContext, event: AgentMessageSent) -> None:
        pinned = {notice.data.get("link") for notice in context.journal.get(Notices)._standing()}
        for url in dict.fromkeys(match.rstrip(".,;:!?") for match in LINK.findall(event.text)):
            if url in pinned or SELF_PINNED.match(url) or not context.once(UNPINNED, url):
                continue
            context.agent.whisper(UNPINNED, url=url)
