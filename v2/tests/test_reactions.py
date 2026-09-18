import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from v2.controllers.types import CONTROLLERS  # noqa: E402
from v2.resources.base import AGENT, USER  # noqa: E402
from v2.tests.kit import check, done, fresh  # noqa: E402


def refused(fn):
    try:
        fn()
        return ""
    except Exception as e:
        return str(e)


record = fresh()
messages = CONTROLLERS["message"](record, actor=AGENT)
m = messages.create("a reply worth a face")
by_user = CONTROLLERS["message"](record, actor=USER)
reactions = CONTROLLERS["reaction"](record)

# A REACTION is one face by one actor on one message, linked to it; the same face again takes it off
by_user.react(m.n, "👍")
check("a face on a message: a reaction linked to it, by the user", [(r.data["face"], r.refs, r.seen) for r in reactions.all()], [("👍", [m.ref], [USER])])
by_user.react(m.n, "🎉")
check("another face stands beside it", [r.data["face"] for r in reactions.linked_to(m.ref)], ["👍", "🎉"])
by_user.react(m.n, "👍")
check("the same face again removes it", [r.data["face"] for r in reactions.linked_to(m.ref)], ["🎉"])
messages.react(m.n, "🎉")
check("the agent's same face is its own, not the user's", sorted(r.seen[0] for r in reactions.linked_to(m.ref)), [AGENT, USER])
check("a face outside the nine is refused", refused(lambda: by_user.react(m.n, "🐍")).startswith("a reaction is one of"), True)
check("the user's reactions are events the agent is told of: put on, linked, taken off", [e.action for e in record.events() if e.type == "reaction" and e.actor == USER], ["created", "linked", "created", "linked", "deleted"])

# A NOTICE is one line kept until closed, with a tone and a link
notices = CONTROLLERS["notice"](record, actor=AGENT)
n = notices.create("the migration is running, do not deploy", tone="warn", link="https://example/pr/1", label="Open the PR")
check("a notice carries its tone, link and label", (n.data["tone"], n.data["link"], n.data["label"]), ("warn", "https://example/pr/1", "Open the PR"))
check("the notice's words: close", notices.named("complete"), "close")
CONTROLLERS["notice"](record, actor=USER).method("close")(n.n)
check("the user's X closes it", bool(notices.load(n.n).completed), True)

done()
