import features
from controllers.types import Docs, Plans
from controllers.types import Templates
from resources.base import AGENT, USER
from tests.conftest import fresh, refused


def test_a_functional_design_is_a_doc_whose_approval_makes_the_plan():
    from features.templates.shipped import ship
    features.load()
    record = fresh()
    assert (ship(record), ship(record)) == (["Functional design", "Find what is wrong", "Find what is missing", "Challenge the approach"], []), "shipped once, never twice"
    functional = next(r for r in Templates(record, actor=USER).rows.summaries() if r.title == "Functional design")
    design = Docs(record, actor=AGENT).create("Queue autoscaler", abstract="Scale workers from queue depth", template=functional.n)
    assert [s["title"] for s in Docs(record, actor=AGENT).load(design.n).sections][:3] == ["What it is for", "What the user sees and does", "Must have"], \
        "a design starts from the parts anyone can read"
    plan = Plans(record, actor=USER).from_doc(design.n)
    assert ([s["title"] for s in plan.sections], design.ref in plan.refs, plan.brief.startswith(f"Built from the functional design, doc {design.n}")) == \
        (["Must have"], True, True), "the plan carries the checklist its rows must cover, and points at the design"
    phased = Docs(record, actor=AGENT).create("Rollout", abstract="Ship it in steps")
    Docs(record, actor=AGENT).section(phased.n, "Phase 1: Build the queue", "Make it work")
    Docs(record, actor=AGENT).section(phased.n, "Notes", "Not a phase")
    assert [phase["title"] for phase in Plans(record, actor=USER).from_doc(phased.n).data["phases"]] == ["Build the queue"], \
        "a design's phase sections become the phases of its plan, and its other sections stay out"

    from engine import runtime
    from migrations.m0021_functional_design_is_a_doc import run
    older = fresh()
    runtime.env_file(older.root).parent.mkdir(parents=True, exist_ok=True)
    runtime.env_file(older.root).write_text(older.env)
    blank = Templates(older, actor=USER).create("Blank plan")
    assert run(older.root).startswith("plan templates replaced by the functional design doc: 1 retired, Functional design"), "an old blank plan template is retired and the new one shipped"
    assert Templates(older, actor=USER).load(blank.n).completed, "the retired template is closed"


def test_a_template_asks_for_its_fields_and_fills_them_in():
    from controllers.types import Todos
    from controllers.types import Templates
    record = fresh()
    templates = Templates(record, actor=USER)
    critique = templates.create("Critique", brief="Send {{agents}} agents, looking for {{focus}}.")
    templates.section(critique.n, "Brief", "{{agents}} reviewers, {{focus}}")
    templates.field(critique.n, "Agents", kind="number", default="2")
    templates.field(critique.n, "Focus", kind="choice", options="mistakes, additions")
    assert refused(lambda: templates.field(critique.n, "Tone", kind="choice")) == "a choice field needs --options \"one, two, three\"", \
        "a choice field without options is refused"
    assert "a field is one of" in refused(lambda: templates.field(critique.n, "Tone", kind="colour")), "a field is one of the kinds a template knows"
    assert "needs a label with a letter or a number" in refused(lambda: templates.field(critique.n, "!!!")), "a field is named by its label, so the label needs a letter or a number"
    row = Todos(record, actor=USER).create("Critique plan 3", template=critique.n, template_values={"focus": "mistakes"})
    assert Todos(record, actor=USER).load(row.n).sections[0]["body"] == "2 reviewers, mistakes", \
        "the parts are filled from the values given, a field left out takes its default"
