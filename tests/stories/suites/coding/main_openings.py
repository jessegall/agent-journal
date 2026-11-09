from suites.coding.support.main_opening import CODE_ALLOWED, CODE_FORBIDDEN, CONTINUE_LINE, WORKERS_DISABLED_LINE, MainOpening
from suites.coding.support.main_options import BUILDER, ORCHESTRATOR, MainOptions
from tests.stories.support.story_checks import expect_value


def read_options(bundle: tuple[bool, ...]) -> MainOptions:
    return MainOptions(*bundle)


def test_s46_the_builder_opening_allows_code_and_has_no_orchestrator_paragraph():
    lines = MainOpening(read_options(BUILDER)).lines()
    expect_value((CODE_ALLOWED in lines, CODE_FORBIDDEN in lines, CONTINUE_LINE in lines), (True, False, False))


def test_s46_the_orchestrator_opening_forbids_code_and_keeps_going():
    lines = MainOpening(read_options(ORCHESTRATOR)).lines()
    expect_value((CODE_FORBIDDEN in lines, CODE_ALLOWED in lines, CONTINUE_LINE in lines), (True, False, True))


def test_s46_a_custom_opening_follows_each_control_and_never_names_a_work_preference():
    custom = MainOptions(auto=False, sends_workers=False, continues_work=False, merger=True, helpers=False, designer=True, may_merge=False, writes_code=False)
    lines = MainOpening(custom).lines()
    expect_value((CODE_FORBIDDEN in lines, WORKERS_DISABLED_LINE in lines, any("preference" in line for line in lines)), (True, True, False))


def test_s45_the_work_modes_skill_names_the_single_auto_setting_and_what_it_leaves_allowed():
    text = open("src/suites/coding/skills/journal-work-modes/SKILL.md").read()
    expect_value(("The main agent may also write code itself" in text, "does not pause receiving tasks" in text, "work preference" in text), (True, True, False))
