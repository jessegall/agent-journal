import pytest

import features
from features.plans.controller import Plans  # noqa: E402
from controllers.types import Docs, Reports
from resources.base import AGENT
from tests.kit import nudges, report
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


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
