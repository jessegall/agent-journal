from tests.stories.core.base.viewer.support.window_faults import PATH
from tests.stories.core.support.fixtures import MainEnvironment


def test_a_window_name_used_twice_is_refused_at_sync(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:DuplicateWindowModule", "two windows named twice.board")


def test_a_window_name_not_starting_with_its_module_is_refused_at_sync(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:ForeignNameModule", "the window other.board does not start with its module's name, foreign")


def test_a_window_whose_entry_file_is_missing_is_refused_at_sync(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:MissingEntryModule", "missing.board loads absent.html, which is not in its module's web/dist")


def test_a_window_reading_a_line_that_is_no_read_is_refused_at_sync(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:UnknownReadModule", "reads.board reads task fly, which is no read subcommand")


def test_a_window_running_a_line_that_is_no_command_is_refused_at_sync(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:UnknownRunModule", "runs.board runs task list, which is no command")


def test_a_window_following_events_no_model_has_is_refused_at_sync(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:UnknownEventModule", "events.board follows rocket.launch, which no model's events match")


def test_a_window_following_events_of_a_model_it_does_not_read_is_refused_at_sync(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:UncoveredEventModule", "uncovered.board follows plan.* but reads no plan")


def test_a_window_naming_one_option_key_twice_is_refused_at_sync(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:TwiceOptionModule", "options.board names the option flush twice")


def test_a_window_counting_with_a_line_it_does_not_read_is_refused_at_sync(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:UnreadCountModule", "counts.board counts with plan list, which is not one of its reads")


def test_a_window_showing_an_icon_outside_the_shells_set_is_refused_at_sync(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:UnknownIconModule", "the window icons.board shows the icon rocket, which is not in the shell's icon set")


def test_a_choice_option_starting_outside_its_choices_is_refused_at_sync(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:OutsideChoiceModule", "choices.board starts its option range at year, which is none of its choices")


def test_a_window_floating_at_no_size_is_refused_at_sync(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:FlatFloatModule", "floats.board floats at 0 by 300, and a size is above 0")


def test_a_suite_preset_showing_a_window_the_suite_does_not_offer_is_refused_at_sync(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:ForeignPresetModule", "suite presets's preset chat for home shows messages.chat, which the suite does not offer")


def test_two_presets_of_a_page_under_one_key_are_refused_at_sync(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:ForeignPresetModule", "suite presets offers two presets keyed board for home")


def test_a_page_window_of_a_module_the_journal_does_not_ship_is_recorded_for_the_people_who_trust_it(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:PageWindowModule")
    story.expect_registered_window("pages.board", "")


def test_a_window_built_for_another_kit_is_recorded_as_unavailable_and_not_refused(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:NewerKitModule")
    story.expect_registered_window("kits.board", "built for window kit >=2,<3; this viewer has kit 1")


def test_a_sync_that_changes_the_registry_logs_one_registry_sync_event(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:NewerKitModule")
    story.expect_logged_event("registry.sync")



def test_a_window_sharing_a_read_it_does_not_have_is_refused_at_sync(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:UnreadShareModule", "shares.board shares plan show, which is not one of its reads")
