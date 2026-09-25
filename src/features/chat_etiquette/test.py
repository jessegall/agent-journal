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
    chat.send(record, agent, "You reacted to the test-suite result. Nothing else is waiting.")
    assert [n for n in nudges(record) if "journal's workings" in n] == \
        ['your chat talked about the journal\'s workings - "A new message came in"',
         'your chat talked about the journal\'s workings - "Your message is answered"',
         'your chat talked about the journal\'s workings - "You reacted"'], \
        "only the turn about the journal's workings is named back"
    from features.chat_etiquette.handlers import SHOP_TALK
    assert [SHOP_TALK.search(text).group(0) for text in ("Message 4636 is answered. Continuing.",
                                                          "The replies to messages 4749, 4750 went out, but they're still listed as waiting.",
                                                          "Closing both explicitly:")] == \
        ["Message 4636 is answered", "replies to messages 4749, 4750 went out", "Closing both explicitly"], \
        "the state of the user's rows is not news either"
    assert SHOP_TALK.search("To-do 1013 trims the log; the reply hint is in the brief.") is None, "naming a row and its work is fine"
    assert SHOP_TALK.search("plus journal-todos once to-do 1024 is done") is None, "and so is naming what happens once a row is done"
    assert "journal-chat-etiquette" in primary(), "its skill is loaded at every start, like the journal's own"


def test_every_twentieth_journal_line_reminds_the_agent_of_chat_etiquette():
    from engine import ran
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    agent = Agents(record, actor="system").by_session("claude-1")
    reminded = lambda: [n for n in nudges(record) if n.startswith("chat etiquette")]
    for _ in range(19):
        ran.announce(record, agent.n, ran.DELIVERED, "2 new messages 314, 315")
    assert not reminded(), "nineteen journal lines pass without a reminder"
    ran.announce(record, agent.n, ran.DELIVERED, "todo 5 next")
    assert len(reminded()) == 1, "the twentieth reminds the agent that a journal line is acted on or noted, never answered in the chat"
