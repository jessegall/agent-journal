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
    plans = Plans(record, actor=USER)
    plans.approve(plan.n)
    plans.start(plan.n)
    Works(record, actor=AGENT).create("digest research", todo=row.n)
    assert [n.title for n in Nudges(record).all() if n.title.startswith(f"template {flow.n}")], "starting its work tells the agent the instructions"


def test_a_functional_design_is_a_doc_whose_approval_makes_the_plan():
    from features.templates.shipped import ship
    features.load()
    record = fresh()
    assert (ship(record), ship(record)) == (["Functional design", "Find what is wrong", "Find what is missing", "Challenge the approach"], []), "shipped once, never twice"
    functional = next(r for r in Templates(record, actor=USER).summaries() if r["title"] == "Functional design")
    design = Docs(record, actor=AGENT).create("Queue autoscaler", abstract="Scale workers from queue depth", template=functional["n"])
    assert [s["title"] for s in Docs(record, actor=AGENT).load(design.n).sections][:3] == ["What it is for", "What the user sees and does", "Must have"], \
        "a design starts from the parts anyone can read"
    plan = Plans(record, actor=USER).from_doc(design.n)
    assert ([s["title"] for s in plan.sections], design.ref in plan.refs, plan.brief.startswith(f"Built from the functional design, doc {design.n}")) == \
        (["Must have"], True, True), "the plan carries the checklist its rows must cover, and points at the design"


def test_a_template_asks_for_its_fields_and_fills_them_in():
    from controllers.types import Todos
    from features.templates.controller import Templates
    record = fresh()
    templates = Templates(record, actor=USER)
    critique = templates.create("Critique", brief="Send {{agents}} agents, looking for {{focus}}.")
    templates.section(critique.n, "Brief", "{{agents}} reviewers, {{focus}}")
    templates.field(critique.n, "Agents", kind="number", default="2")
    templates.field(critique.n, "Focus", kind="choice", options="mistakes, additions")
    assert refused(lambda: templates.field(critique.n, "Tone", kind="choice")) == "a choice field needs --options \"one, two, three\"", \
        "a choice field without options is refused"
    row = Todos(record, actor=USER).create("Critique plan 3", template=critique.n, template_values={"focus": "mistakes"})
    assert Todos(record, actor=USER).load(row.n).sections[0]["body"] == "2 reviewers, mistakes", \
        "the parts are filled from the values given, a field left out takes its default"
