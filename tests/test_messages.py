from pathlib import Path

from controllers.types import Comments, Messages
from engine.record import Record
from resources.base import AGENT, USER
from tests.conftest import fresh, refused


def test_messages_are_processed_replied_edited_moved_and_deduplicated_by_key(tmp_path):
    record = fresh()
    left = Messages(record, actor=USER)
    read = Messages(record, actor=AGENT)
    m = left.create("two things", brief="fix the header, and later add a csv export")

    read.process(m.n, "fix the header", "work")
    read.process(m.n, "later add a csv export", "todo 2")
    assert read.load(m.n).sections == [{"title": "fix the header", "body": "work"}, {"title": "later add a csv export", "body": "todo 2"}], \
        "each part becomes a section: the words, then what it became"
    assert read.load(m.n).refs == ["todo:2"], "a part that became a resource links the message to it"
    assert refused(lambda: read.process(m.n, "rewrite everything", "todo 3")) == "that part is not in message 1; quote the words it is about", \
        "a part not in the message is refused"
    read.method("processed")(m.n, "both parts filed")
    assert (bool(read.load(m.n).completed), read.load(m.n).outcome) == (True, "both parts filed"), "processed is the message's complete"

    once = left.create("sent twice", idempotency="k-1")
    assert left.create("sent twice", idempotency="k-1").n == once.n, "a resend with the same key returns the first message"
    read.method("processed")(once.n, "handled")
    assert left.create("sent twice", idempotency="k-1").n == once.n, "a resend after processing is still the first message"
    read.archive(once.n, "duplicate")
    assert (left.create("sent twice", idempotency="k-1").n, len([x for x in left.all(deleted=True) if x.idempotency == "k-1"])) == (once.n, 1), \
        "a resend after archiving creates nothing new"

    shot = tmp_path / "shot.png"
    shot.write_bytes(b"png")
    reply = read.reply(m.n, "done differently: one row, not two", file=str(shot))
    comments = Comments(record)
    assert (reply.refs, reply.seen) == ([m.ref], [AGENT]), "the reply is a comment on the message, by the agent"
    assert reply.brief.startswith("> ") and reply.brief.endswith("\n\ndone differently: one row, not two") is True, \
        "the reply opens on a quote of what it answers"
    assert (comments.files(reply.n), comments.load(reply.n).data["files"]) == (["shot.png"], {"shot.png": ""}), \
        "the file is kept in the comment's own folder"

    fresh_one = left.create("a typo hear")
    left.edit(fresh_one.n, "a typo here")
    assert left.load(fresh_one.n).brief == "a typo here", "edited while unread"
    read.show(fresh_one.n)
    assert refused(lambda: left.edit(fresh_one.n, "again")) == f"message {fresh_one.n} has been read: leave a new one", \
        "read by the agent: the user is told to leave a new one"

    t = left.create("the call with the team", brief="A: we ship friday\nB: agreed", kind="transcript")
    assert t.data["kind"] == "transcript", "declared on create"
    later = left.create("pasted later", brief="A: hi\nB: hi")
    left.declare(later.n, "transcript")
    assert left.load(later.n).data["kind"] == "transcript", "declared after the fact"

    queued = left.create("a queued message", idempotency="outbox-1")
    same = left.create("a duplicate", idempotency="outbox-1")
    assert (same.n, len(left.all()), same.idempotency) == (queued.n, 5, "outbox-1"), \
        "the same idempotency key returns the original message"

    moved = read.move(m.n, "other")
    there = Messages(Record(record.root, "other"))
    assert (moved.n, there.load(moved.n).title, len(there.load(moved.n).sections)) == (1, "two things", 2), \
        "the message lives there with its sections"
    assert (True, [e for e in record.events() if e.type == "message" and e.action == "deleted"][-1].data["why"]) == \
        (True, "moved to other as message 1"), "here it is deleted, saying where it went"
    assert [e.data for e in there.record.events() if e.type == "message"][-1] == {"moved_from": "t/1"}, \
        "the other environment got a created event that says where from"

    edited = left.create("first words", brief="first words")
    left.edit(edited.n, "the words after an edit")
    assert left.load(edited.n).title == "the words after an edit", "an edited message is titled from its new words"
    left.update(edited.n, title="a title of my own", brief="and new words beside it")
    assert left.load(edited.n).title == "a title of my own", "a title given with the edit is kept"
