from tests.stories.core.base.chat.support.mark_faults import PATH
from tests.stories.core.support.fixtures import MainEnvironment


def refused(new_story, module: str, text: str) -> None:
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:{module}", text)


def test_a_valid_mark_and_dock_pass_at_sync(new_story):
    new_story(fixture=MainEnvironment).expect_sync_success(f"{PATH}:GoodModule")


def test_a_mark_type_used_twice_is_refused_at_sync(new_story):
    refused(new_story, "DuplicateMarkModule", "two mark types named twice.first")


def test_a_mark_type_not_starting_with_its_module_is_refused_at_sync(new_story):
    refused(new_story, "ForeignNameModule", "the mark other.note does not start with its module's name, foreign")


def test_a_variants_enum_with_no_members_is_refused_at_sync(new_story):
    refused(new_story, "NoVariantModule", "the mark good.note has a variants enum, NoVariant, with no members")


def test_a_mark_with_an_icon_outside_the_shells_set_is_refused_at_sync(new_story):
    refused(new_story, "UnknownIconModule", "the mark good.note shows the icon rocket, which is not in the shell's icon set")


def test_a_button_running_no_command_is_refused_at_sync(new_story):
    refused(new_story, "UnknownCommandModule", "the mark good.note has the button Fly running task fly {row_id}, which names no command")


def test_a_button_filling_another_placeholder_is_refused_at_sync(new_story):
    refused(new_story, "SecondPlaceholderModule", "filling {task_id}, and only {row_id} is filled")


def test_a_mark_body_missing_from_web_dist_is_refused_at_sync(new_story):
    refused(new_story, "MissingBodyModule", "the mark good.note loads absent.js, which is not in its module's web/dist")


def test_a_click_opening_a_row_with_no_row_model_is_refused_at_sync(new_story):
    refused(new_story, "RowMarkWithoutModelModule", "the mark good.note opens a row, and good declares and depends on no row model")


def test_a_group_label_with_another_field_is_refused_at_sync(new_story):
    refused(new_story, "BadLabelModule", "which takes only {family}, {type} and {count}")


def test_a_dock_that_holds_no_item_is_refused_at_sync(new_story):
    refused(new_story, "EmptyDockModule", "the dock good.note allows at most 0 items, and it holds at least 1")


def test_a_dock_reading_a_line_that_is_no_read_is_refused_at_sync(new_story):
    refused(new_story, "UnknownReadDockModule", "the dock good.note reads task fly, which is no read subcommand")


def test_a_dock_type_not_starting_with_its_module_is_refused_at_sync(new_story):
    refused(new_story, "ForeignDockModule", "the dock good.note does not start with its module's name, foreign")
