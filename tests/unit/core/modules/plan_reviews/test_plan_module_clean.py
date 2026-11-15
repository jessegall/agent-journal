from pathlib import Path
import json

from core.modules.plans.plans_module import PlansModule

CHECKOUT = Path(__file__).resolve().parents[5]
RULES = CHECKOUT / ".commandments/custom"
SAMPLES = RULES / "samples/plans"
REVIEW_TERMS = ("review", "critique")


def test_the_plans_module_lists_no_mod_among_its_dependencies():
    assert all(('plan_reviews' not in name and 'reviews' not in name for name in PlansModule.dependencies))


def test_no_skill_or_agent_message_of_the_plans_module_names_a_review_or_a_critique():
    skills = (CHECKOUT / "src/core/modules/plans/skills").rglob("*.md")
    texts = [path.read_text().lower() for path in skills] + [agent_message.text.lower() for agent_message in PlansModule.agent_message_declarations()]
    texts += [f"{skill.folder} {skill.description} {' '.join(skill.keywords)}".lower() for skill in PlansModule.skill_declarations()]
    assert all((word not in text for text in texts for word in REVIEW_TERMS))


def test_the_plan_inspector_files_do_not_name_review_rows():
    files = [CHECKOUT / "src/viewer/src/resource/PlanDetails.vue", CHECKOUT / "src/core/modules/plans/inspectors/plan_inspector.py"]
    assert all((word not in path.read_text().lower() for path in files for word in REVIEW_TERMS))
    assert not (CHECKOUT / 'src/viewer/src/resource/PlanReviews.vue').exists()


def test_the_detector_rules_each_name_the_plan_files_and_carry_a_sample():
    for rule in ("architecture_plans_names_no_mod_identifier", "architecture_plans_names_no_mod_literal", "architecture_plans_names_no_mod_viewer"):
        text = json.loads((RULES / f"{rule}.json").read_text())
        assert text['sin']['name'].startswith('plan-module-names-a-mod')
        assert 'plans' in json.dumps(text['find']) or 'Plan' in json.dumps(text['find'])
    assert any(SAMPLES.rglob('*.py'))
    assert any(SAMPLES.rglob('*.vue'))
