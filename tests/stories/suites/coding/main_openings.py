from suites.coding.support.main_opening import CODE_ALLOWED, CODE_FORBIDDEN, KEEPS_GOING, NO_WORKERS, MainOpening
from suites.coding.support.main_options import BUILDER, ORCHESTRATOR, MainOptions
from tests.stories.support.story_checks import expect_value


def options_of(bundle: tuple[bool, ...]) -> MainOptions:
    return MainOptions(*bundle)


def test_s46_the_builder_opening_allows_code_and_has_no_orchestrator_paragraph():
    lines = MainOpening(options_of(BUILDER)).lines()
    expect_value((CODE_ALLOWED in lines, CODE_FORBIDDEN in lines, KEEPS_GOING in lines), (True, False, False))


def test_s46_the_orchestrator_opening_forbids_code_and_keeps_going():
    lines = MainOpening(options_of(ORCHESTRATOR)).lines()
    expect_value((CODE_FORBIDDEN in lines, CODE_ALLOWED in lines, KEEPS_GOING in lines), (True, False, True))


def test_s46_a_custom_opening_follows_each_control_and_never_names_a_work_preference():
    custom = MainOptions(auto=False, sends_workers=False, keeps_going=False, merger=True, helpers=False, designer=True, may_merge=False)
    lines = MainOpening(custom).lines()
    expect_value((CODE_FORBIDDEN in lines, NO_WORKERS in lines, any("preference" in line for line in lines)), (True, True, False))
