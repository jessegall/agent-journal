import json
from pathlib import Path

from core.modules.plans.plans_module import PlansModule
from tests.stories.core.support.fixtures import MainEnvironment

CHECKOUT = Path(__file__).resolve().parents[5]
RULES = CHECKOUT / ".commandments/custom"
SAMPLES = RULES / "samples/plans"
REVIEW_TERMS = ("review", "critique")


def test_the_plans_module_lists_no_mod_among_its_dependencies(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_rows(all("plan_reviews" not in name and "reviews" not in name for name in PlansModule.dependencies))


def test_no_skill_or_nudge_of_the_plans_module_names_a_review_or_a_critique(new_story):
    story = new_story(fixture=MainEnvironment)
    skills = (CHECKOUT / "src/core/modules/plans/skills").rglob("*.md")
    texts = [path.read_text().lower() for path in skills] + [nudge.text.lower() for nudge in PlansModule.nudges]
    texts += [f"{skill.folder} {skill.description} {' '.join(skill.keywords)}".lower() for skill in PlansModule.skills]
    story.expect_rows(all(word not in text for text in texts for word in REVIEW_TERMS))


def test_the_plan_inspector_files_do_not_name_review_rows(new_story):
    story = new_story(fixture=MainEnvironment)
    files = [CHECKOUT / "src/viewer/src/resource/PlanDetails.vue", CHECKOUT / "src/viewer/src/resource/PlanInspector.vue"]
    story.expect_rows(all(word not in path.read_text().lower() for path in files for word in REVIEW_TERMS),
                      not (CHECKOUT / "src/viewer/src/resource/PlanReviews.vue").exists())


def test_the_detector_rules_each_name_the_plan_files_and_carry_a_sample(new_story):
    story = new_story(fixture=MainEnvironment)
    for rule in ("architecture_plans_names_no_mod_identifier", "architecture_plans_names_no_mod_literal", "architecture_plans_names_no_mod_viewer"):
        text = json.loads((RULES / f"{rule}.json").read_text())
        story.expect_rows(text["sin"]["name"].startswith("plan-module-names-a-mod"), "plans" in json.dumps(text["find"]) or "Plan" in json.dumps(text["find"]))
    story.expect_rows(any(SAMPLES.rglob("*.py")), any(SAMPLES.rglob("*.vue")))
