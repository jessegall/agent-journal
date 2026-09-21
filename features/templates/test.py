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


def test_the_templates_instructions_come_before_the_work_for_the_agent():
    from controllers.types import Nudges, Todos, Works
    from tests.kit import report
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    templates = Templates(record, actor=USER)
    flow = templates.create("Research first", brief="Write the functional doc before any code", applies_to="plan")
    templates.section(flow.n, "Research", "the doc is approved")
    plans = Plans(record, actor=AGENT)
    plan = plans.create("Digest", goal="a digest", template=flow.n)
    row = Todos(record, actor=AGENT).create("look into the digest")
    plans.stage(plan.n, "todos")
    plans.place(plan.n, 1, [row.n])
    assert Todos(record, actor=AGENT).show(row.n).preface.startswith(f"TEMPLATE {flow.n}, Research first"), \
        "a row under a plan made from a template shows its instructions first"
    plans.ready(plan.n)
    Plans(record, actor=USER).activate(plan.n)
    Works(record, actor=AGENT).create("digest research", todo=row.n)
    assert [n.title for n in Nudges(record).all() if n.title.startswith(f"template {flow.n}")], "starting its work tells the agent the instructions"


def test_the_journal_ships_a_blank_and_a_functional_first_plan_template():
    from features.templates.shipped import ship
    features.load()
    record = fresh()
    assert (ship(record), ship(record)) == (["Blank plan", "Functional design, then technical implementation"], []), "shipped once, never twice"
    functional = next(r for r in Templates(record, actor=USER).summaries() if r["title"].startswith("Functional"))
    plan = Plans(record, actor=AGENT).create("Standup digest", goal="a digest", template=functional["n"])
    assert [(p["title"], p["checkpoint"]) for p in Plans(record, actor=AGENT).load(plan.n).phases] == \
        [("Functional design", True), ("Technical implementation", False)], "the functional design is approved at a checkpoint before any build"
