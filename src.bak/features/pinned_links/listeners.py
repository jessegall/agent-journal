import re

from events import Fact
from events.agents import AgentMessageSent
from events.pinned_links import LinkUnpinned
from receiving import Listener
from resources.types import Notice
from serving import ReadRows

LINK = re.compile(r"https?://[^\s<>()\[\]\"'`]+")
SELF_PINNED = re.compile(r"^https?://(?:localhost|127\.0\.0\.1)[:/]|^https://github\.com/[^/]+/[^/]+/pull/\d+")


class SpotUnpinnedLinks(Listener[AgentMessageSent]):
    def listen(self, event: AgentMessageSent, notices: ReadRows[Notice]) -> list[Fact]:
        pinned = {notice.data.get("link") for notice in notices.rows.standing()}
        urls = dict.fromkeys(match.rstrip(".,;:!?") for match in LINK.findall(event.text))
        return [LinkUnpinned(agent=event.agent, url=url).once(f"unpinned|{url}") for url in urls if url not in pinned and not SELF_PINNED.match(url)]
