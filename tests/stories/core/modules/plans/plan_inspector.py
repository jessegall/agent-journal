from engine.database.database import Database
from engine.registry.registry import Registry
from engine.enums.panel_labels import PanelLabels
from core.modules.plans.models.plan import Plan
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.support.story_checks import expect_value


def inspector_declaration(story):
    registry = Registry.read(story.container.get(Database))
    return registry, next(entry.declaration for entry in registry.inspectors if entry.declaration.model is Plan)


def offered(declaration, state: str) -> list[str]:
    return [action.label for action in declaration.actions if state in action.condition.values]


def test_a_started_plan_offers_pause_complete_and_cancel(new_story):
    registry, declaration = inspector_declaration(new_story(fixture=MainEnvironment))
    expect_value(offered(declaration, "started"), ["Assign to an agent", "Let the agent pick", "Pause the plan", "Complete the plan", "Cancel the plan"])
    expect_value(next(action for action in declaration.actions if action.label == "Complete the plan").runs, "plan close {row_id}")


def test_an_approved_plan_offers_start_and_cancel(new_story):
    registry, declaration = inspector_declaration(new_story(fixture=MainEnvironment))
    expect_value(offered(declaration, "approved"), ["Assign to an agent", "Let the agent pick", "Start the plan", "Cancel the plan"])


def test_assigning_a_plan_runs_plan_assign_with_a_worker_or_without(new_story):
    registry, declaration = inspector_declaration(new_story(fixture=MainEnvironment))
    runs = {action.label: action.runs for action in declaration.actions}
    expect_value(bool(runs["Assign to an agent"] == "plan assign {row_id} --to={agent}" and runs["Let the agent pick"] == "plan assign {row_id}"), True)


def test_a_completed_plan_offers_nothing(new_story):
    registry, declaration = inspector_declaration(new_story(fixture=MainEnvironment))
    expect_value(bool(offered(declaration, "completed") == [] and offered(declaration, "cancelled") == []), True)


def test_no_plan_action_is_called_close(new_story):
    registry, declaration = inspector_declaration(new_story(fixture=MainEnvironment))
    labels = [button.declaration.label for button in registry.buttons if any(slot in ("row.plan", "dock.plans.waiting") for slot in button.declaration.slots)]
    expect_value(bool(labels and not any(PanelLabels.begins(label) for label in labels)), True)


def test_the_plan_inspector_declares_its_components_and_links(new_story):
    registry, declaration = inspector_declaration(new_story(fixture=MainEnvironment))
    expect_value([(component.window, component.tab) for component in declaration.components], [("plans.plan-details", ""), ("plans.plan-phases", ""), ("plans.plan-timeline", "Timeline")])
    expect_value((declaration.width.value, declaration.comments, declaration.links.excludes_plan), ("large", True, True))
    expect_value({window.name for window in registry.windows if window.place == "section"} >= {"plans.plan-details", "plans.plan-phases", "plans.plan-timeline"}, True)


def test_the_reviewing_state_keeps_its_buttons(new_story):
    registry, declaration = inspector_declaration(new_story(fixture=MainEnvironment))
    expect_value(offered(declaration, "reviewing"), [])
    buttons = {entry.declaration.name: entry.declaration for entry in registry.buttons}
    expect_value([tuple(buttons[name].condition.values) for name in ("plan_reviews.end-review", "plan_reviews.cancel")], [tuple(["reviewing"]), tuple(["reviewing"])])
    expect_value(buttons["plan_reviews.cancel"].runs, "plan cancel {row_id} --reason={reason}")
