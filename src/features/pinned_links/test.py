import features
from controllers.types import Agents
from tests.conftest import fresh
from tests.kit import nudges, report


def test_a_link_in_the_chat_that_no_pin_carries_is_named_once_with_the_command_to_pin_it():
    from engine import chat
    from resources.base import SYSTEM
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    agent = Agents(record, actor=SYSTEM).by_session("claude-1")
    design = "https://claude.ai/design/p/abc?file=Board.dc.html"
    from controllers.types import Notices
    Notices(record, actor=SYSTEM).create("Design - Plans", link="https://claude.ai/design/p/pinned", label="Open the design")
    chat.send(record, agent, f"The design is ready: [Board]({design}). Also https://claude.ai/design/p/pinned, http://127.0.0.1:8424/ and https://github.com/o/r/pull/12.")
    chat.send(record, agent, f"Same link again: {design}.")
    from controllers.types import Nudges
    briefs = [row.brief for row in Nudges(record, actor=SYSTEM)._every() if row.title.startswith("a link you gave")]
    assert [brief.split(" - ")[0] for brief in briefs] == [design], \
        "an unpinned outside link is named once; a pinned one, the viewer and a pull request are not"
