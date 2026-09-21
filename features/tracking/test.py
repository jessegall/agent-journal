
from controllers.types import Messages, Facts, Todos
from resources.base import AGENT, USER
from tests.conftest import fresh
from features.plans.controller import Plans  # noqa: E402
from controllers.types import Docs, Reports
from resources.base import AGENT
from tests.kit import nudges, report


def test_what_is_filed_while_a_message_is_in_hand_is_linked_to_it_until_it_closes():
    record = fresh()
    messages = Messages(record, actor=USER)
    todos = Todos(record, actor=AGENT)

    m = messages.create("please park the widget work and pin the port")
    loose = todos.create("a row with no message behind it")
    assert messages.load(m.n).refs == [], "a message the agent has not read is not in its hands"

    Messages(record, actor=AGENT).read(m.n)
    todo = todos.create("the widget work")
    pin = Facts(record, actor=AGENT).create("the port is 8422")
    assert messages.load(m.n).refs == [todo.ref, pin.ref], \
        "a to-do and a pin filed while the message is in hand are linked to it, by the feature"
    assert (loose.n in [int(r.split(":")[1]) for r in messages.load(m.n).refs if r.startswith("todo:")]) is False, \
        "the loose row from before stays unlinked"

    Todos(record, actor=USER).create("the user's own row")
    Messages(record, actor=AGENT).reply(m.n, "on it")
    assert len(messages.load(m.n).refs) == 2, "a row the user files, and the agent's reply, are not linked as what it became"

    assert bool(messages.load(m.n).completed) is True, "the agent's reply closed the message"
    later = todos.create("after the message was closed")
    assert (later.ref in messages.load(m.n).refs) is False, "a closed message takes nothing more"


def said(record):
    return [n for n in nudges(record) if "cites nothing" in n]


def test_a_plan_built_on_a_report_just_read_citing_none_of_it_is_named_back_to_the_agent():
    record = fresh()
    report(record, "working", "PreToolUse")
    source = Reports(record, actor=AGENT).create("what the audit found")
    Reports(record, actor=AGENT).read(source.n)
    plan = Plans(record, actor=AGENT).create("the plan it led to", goal="g")
    assert said(record) == [f"plan {plan.n} cites nothing it was built on"], \
        "the plan cites nothing, so the agent is told which link to make"
    cited = Plans(record, actor=AGENT).create("one that cites its source", goal="g", about=source.ref)
    assert [n for n in said(record) if f"plan {cited.n}" in n] == [], "one that cites the report is left alone"


def test_with_nothing_read_lately_nothing_is_said():
    quiet = fresh()
    report(quiet, "working", "PreToolUse")
    Plans(quiet, actor=AGENT).create("a plan out of nowhere", goal="g")
    assert said(quiet) == [], "with nothing read there is nothing to cite"


def test_a_doc_counts_as_a_source_too():
    also = fresh()
    report(also, "working", "PreToolUse")
    doc = Docs(also, actor=AGENT).create("what stays true")
    Docs(also, actor=AGENT).read(doc.n)
    made = Plans(also, actor=AGENT).create("built on the doc", goal="g")
    assert said(also) == [f"plan {made.n} cites nothing it was built on"], "a doc read just now is offered as the source"
