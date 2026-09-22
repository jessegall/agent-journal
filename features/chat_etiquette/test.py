import features
from controllers.types import Agents
from tests.conftest import fresh
from tests.kit import nudges, report


def test_chat_that_talks_about_the_journal_is_named_back_and_the_skill_is_always_loaded():
    from engine import chat
    from features.skill_loading.catalogue import primary
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    agent = Agents(record, actor="system").by_session("claude-1")
    chat.send(record, agent, 'The build is green; it now catches lines like "your message is answered".')
    chat.send(record, agent, "Released 2.85.18. A new message came in, so I'm reading it:")
    chat.send(record, agent, "Your message is answered. Now the terminal view.")
    assert [n for n in nudges(record) if "journal's workings" in n] == \
        ['your chat talked about the journal\'s workings - "A new message came in"',
         'your chat talked about the journal\'s workings - "Your message is answered"'], \
        "only the turn about the journal's workings is named back"
    assert "journal-chat-etiquette" in primary(), "its skill is loaded at every start, like the journal's own"
