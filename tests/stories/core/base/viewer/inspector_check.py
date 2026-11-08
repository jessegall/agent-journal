from core.base.database.database import Database
from core.base.registry.registry import Registry
from tests.stories.core.base.viewer.support.inspector_faults import PATH, NoIconModule, PanelWordModule
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.support.story_checks import expect_value


def test_two_declarations_for_one_model_are_refused(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:FirstModule")
    story.expect_sync_refusal(f"{PATH}:SecondModule", "the model reminder has two inspectors, one in first and one in second")


def test_a_component_that_is_not_a_section_is_refused(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:PaneComponentModule", "the inspector of reminder draws the window shown.board, which is not a section")


def test_a_component_of_an_unrelated_module_is_refused(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:UnrelatedWindowModule")
    story.expect_sync_refusal(f"{PATH}:ForeignComponentModule", "the inspector of reminder draws the window stranger.chain of stranger, which it depends on only when listed in dependencies")


def test_an_unknown_read_is_refused(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:UnknownReadModule", "the inspector of reminder reads reminder fly, which is no read subcommand")


def test_events_no_model_has_are_refused(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:UnknownEventModule", "the inspector of reminder follows rocket.launch, which no model's events match")


def test_an_action_on_another_models_row_slot_is_refused(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:OtherRowModule", "the inspector of reminder, action Start the reminder, is on row.plan, which is another model's row")


def test_an_action_without_an_icon_is_refused(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(NoIconModule, "shows no icon, and a button on a card or in an inspector has one")


def test_an_action_with_an_icon_outside_the_set_is_refused(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:UnknownIconModule", "shows the icon rocket, which is not in the shell's icon set")


def test_an_action_starting_with_a_panel_word_is_refused(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(PanelWordModule, "has the label Close the reminder, which starts with a panel word")


def test_inspector_actions_become_buttons_on_the_row_slot(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:ValidModule")
    buttons = {entry.declaration.name: entry.declaration for entry in Registry.read(story.container.get(Database)).buttons}
    expect_value(tuple(buttons["shown.start"].slots), tuple(["row.reminder"]))
