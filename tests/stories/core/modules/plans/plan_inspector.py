from core.base.database.database import Database
from core.base.registry.registry import Registry
from core.base.viewer.panel_words import PanelWords
from core.modules.plans.models.plan import Plan
from tests.stories.core.support.fixtures import MainEnvironment


def declaration_of(story):
    registry = Registry.read(story.container.get(Database))
    return registry, next(entry.declaration for entry in registry.inspectors if entry.declaration.model is Plan)


def offered(declaration, state: str) -> list[str]:
    """The labels of the actions that show for a plan in a state."""
    return [action.label for action in declaration.actions if state in action.condition.values]


def test_a_started_plan_offers_pause_complete_and_cancel(new_story):
    registry, declaration = declaration_of(new_story(fixture=MainEnvironment))
    assert offered(declaration, "started") == ["Pause the plan", "Complete the plan", "Cancel the plan"]
    assert next(action for action in declaration.actions if action.label == "Complete the plan").runs == "plan close {row_id}"


def test_an_approved_plan_offers_start_and_cancel(new_story):
    registry, declaration = declaration_of(new_story(fixture=MainEnvironment))
    assert offered(declaration, "approved") == ["Start the plan", "Cancel the plan"]


def test_a_completed_plan_offers_nothing(new_story):
    registry, declaration = declaration_of(new_story(fixture=MainEnvironment))
    assert offered(declaration, "completed") == [] and offered(declaration, "cancelled") == []


def test_no_plan_action_is_called_close(new_story):
    registry, declaration = declaration_of(new_story(fixture=MainEnvironment))
    labels = [button.declaration.label for button in registry.buttons if any(slot in ("row.plan", "dock.plans.waiting") for slot in button.declaration.slots)]
    assert labels and not any(PanelWords.begins(label) for label in labels)


def test_the_plan_inspector_declares_its_components_and_links(new_story):
    registry, declaration = declaration_of(new_story(fixture=MainEnvironment))
    assert [(component.window, component.tab) for component in declaration.components] == [("plans.plan-details", ""), ("plans.plan-phases", ""), ("plans.plan-timeline", "Timeline")]
    assert (declaration.width.value, declaration.comments, declaration.links.outside_plan) == ("medium", True, True)
    assert {window.name for window in registry.windows if window.place == "section"} >= {"plans.plan-details", "plans.plan-phases", "plans.plan-timeline"}


def test_the_reviewing_state_keeps_its_buttons(new_story):
    registry, declaration = declaration_of(new_story(fixture=MainEnvironment))
    assert offered(declaration, "reviewing") == []
    buttons = {entry.declaration.name: entry.declaration for entry in registry.buttons}
    assert [tuple(buttons[name].condition.values) for name in ("plan_reviews.end-review", "plan_reviews.cancel")] == [("reviewing",), ("reviewing",)]
    assert buttons["plan_reviews.cancel"].runs == "plan cancel {row_id} --reason={reason}"
