from core.base.database.database import Database
from core.base.registry.registry import Registry
from tests.stories.core.base.viewer.support.button_style_modules import PATH, BareCardButtonModule
from tests.stories.core.support.fixtures import MainEnvironment

NO_ICON = "shows no icon, and a button on a card or in an inspector has one"


def button_entry(story, name):
    return next(entry for entry in Registry.read(story.container.get(Database)).buttons if entry.declaration.name == name)


def test_a_shipped_module_with_a_card_button_without_an_icon_is_refused(new_story):
    new_story(fixture=MainEnvironment).expect_shipped_sync_refusal(BareCardButtonModule, f"the button styled.start of module styled {NO_ICON}")


def test_a_module_the_journal_does_not_ship_is_warned_and_still_syncs(new_story):
    story = new_story(fixture=MainEnvironment)
    code, report = story.synced_with(f"{PATH}:BareCardButtonModule")
    assert code == 0 and f"warning: the button styled.start of module styled {NO_ICON}" in report
    assert NO_ICON in button_entry(story, "styled.start").listed()["warning"]


def test_a_panel_word_label_of_a_module_the_journal_does_not_ship_is_warned(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:PanelWordButtonModule")
    assert "starts with a panel word" in button_entry(story, "styled.start").warning


def test_a_valid_button_carries_no_warning(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:PlainCardButtonModule")
    assert "warning" not in button_entry(story, "styled.start").listed()
