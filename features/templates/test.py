import features
from controllers.types import Docs
from features.plans.controller import Plans
from features.templates.controller import Templates
from resources.base import AGENT, USER
from tests.conftest import fresh, refused


def test_a_resource_made_from_a_template_starts_with_its_parts_and_links_it():
    features.load()
    record = fresh()
    templates = Templates(record, actor=USER)
    flow = templates.create("Functional design, then technical implementation", brief="Research first, then build", applies_to="plan")
    templates.section(flow.n, "Functional design (checkpoint)", "the designer approved the functional doc")
    templates.section(flow.n, "Technical implementation", "every row is built and tested")
    plan = Plans(record, actor=AGENT).create("Standup digest", goal="a digest every morning", template=flow.n)
    phases = Plans(record, actor=AGENT).load(plan.n).phases
    assert [(p["title"], p["when"], p["checkpoint"]) for p in phases] == \
        [("Functional design", "the designer approved the functional doc", True), ("Technical implementation", "every row is built and tested", False)], \
        "a plan's phases come from the template's parts, a (checkpoint) title marks a checkpoint"
    assert flow.ref in Plans(record, actor=AGENT).load(plan.n).refs, "the plan links the template it follows"

    notes = templates.create("Meeting notes", brief="Keep it short")
    templates.section(notes.n, "Decisions", "")
    doc = Docs(record, actor=AGENT).create("Monday", template=notes.n)
    assert [s["title"] for s in Docs(record, actor=AGENT).load(doc.n).sections] == ["Decisions"], "any type starts with the parts"
    assert refused(lambda: Docs(record, actor=AGENT).create("Tuesday", template=flow.n)) == f"template {flow.n} is for plan, not a doc", \
        "a template is refused for a type it is not for"
    assert refused(lambda: Docs(record, actor=AGENT).create("Wednesday", template=99)).startswith("template 99 does not exist"), \
        "an unknown template is refused"
