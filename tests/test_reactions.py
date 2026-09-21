from controllers.types import Messages, Notices, Reactions
from resources.base import AGENT, USER
from tests.conftest import fresh, refused


def test_a_reaction_is_one_face_by_one_actor_the_same_face_again_takes_it_off():
    record = fresh()
    messages = Messages(record, actor=AGENT)
    m = messages.create("a reply worth a face")
    by_user = Messages(record, actor=USER)
    reactions = Reactions(record)

    by_user.react(m.n, "👍")
    assert [(r.data["face"], r.refs, r.seen) for r in reactions.all()] == [("👍", [m.ref], [USER])], \
        "a face on a message: a reaction linked to it, by the user"
    by_user.react(m.n, "🎉")
    assert [r.data["face"] for r in reactions.linked_to(m.ref)] == ["👍", "🎉"], "another face stands beside it"
    by_user.react(m.n, "👍")
    assert [r.data["face"] for r in reactions.linked_to(m.ref)] == ["🎉"], "the same face again removes it"
    messages.react(m.n, "🎉")
    assert sorted(r.seen[0] for r in reactions.linked_to(m.ref)) == [AGENT, USER], "the agent's same face is its own, not the user's"
    assert refused(lambda: by_user.react(m.n, "🐍")).startswith("a reaction is one of") is True, "a face outside the nine is refused"
    assert [e.action for e in record.events() if e.type == "reaction" and e.actor == USER] == ["created", "created", "deleted"], \
        "the user's reactions are events the agent is told of: put on (born linked), taken off"


def test_a_notice_is_one_line_kept_until_closed_with_a_tone_and_a_link():
    record = fresh()
    notices = Notices(record, actor=AGENT)
    n = notices.create("the migration is running, do not deploy", tone="warn", link="https://example/pr/1", label="Open the PR")
    assert (n.data["tone"], n.data["link"], n.data["label"]) == ("warn", "https://example/pr/1", "Open the PR"), \
        "a notice carries its tone, link and label"
    assert notices.named("complete") == "close", "the notice's words: close"
    Notices(record, actor=USER).method("close")(n.n)
    assert bool(notices.load(n.n).completed) is True, "the user's X closes it"
