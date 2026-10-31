from core.base.driver.classification import Classification
from core.base.driver.command_category import CommandCategory
from core.base.driver.part import Part
from core.base.driver.shell_line import ShellLine
from core.modules.processes.models.enums.process_setting import ProcessSetting
from core.modules.processes.support.foreground_limit import ForegroundLimit, ForegroundRun


class Settings:
    def integer(self, setting: ProcessSetting, environment_id: int) -> int:
        return setting.default


class Background:
    def __init__(self, journal_verbs: bool = False) -> None:
        self.journal_verbs = journal_verbs

    def includes(self, shell: ShellLine) -> bool:
        return self.journal_verbs


class Rows:
    """Stands in for the process and message queries: whether the line went past the limit and whether a message waits."""

    def __init__(self, went_past: bool = False, waiting: bool = False) -> None:
        self.went_past, self.waiting = went_past, waiting

    def environment(self, environment_id: int) -> "Rows":
        return self

    def line(self, line: str) -> "Rows":
        return self

    def moved(self) -> "Rows":
        return self

    def exists(self) -> bool:
        return self.went_past


class Messages:
    def __init__(self, waiting: bool) -> None:
        self.waiting = waiting

    def query(self, model: type) -> "Messages":
        return self

    def filter(self, **values: object) -> "Messages":
        return self

    def matching(self, condition: object) -> "Messages":
        return self

    def exists(self) -> bool:
        return self.waiting


def part(program: str, category: CommandCategory) -> Part:
    return Part(program, program, "", (), Classification(category, ()), (), (), "", None)


def line(*parts: Part, journal_only: bool = False) -> ShellLine:
    return ShellLine(" && ".join(item.text for item in parts), tuple(parts), (), parts[0].classification.category, journal_only, "")


def limit(went_past: bool = False, waiting: bool = False, journal_verbs: bool = False) -> ForegroundLimit:
    return ForegroundLimit(Settings(), Background(journal_verbs), Rows(went_past), Messages(waiting))  # type: ignore[arg-type]


def test_a_journal_only_line_has_no_limit_to_move_at():
    assert limit().decide(1, line(part("journal", CommandCategory.JOURNAL), journal_only=True)) == ForegroundRun(0, False)


def test_a_journal_command_its_module_marks_goes_to_the_background_at_once():
    assert limit(journal_verbs=True).decide(1, line(part("journal", CommandCategory.JOURNAL), journal_only=True)) == ForegroundRun(30, True)


def test_a_test_run_and_a_build_go_to_the_background_at_once():
    assert limit().decide(1, line(part("pytest", CommandCategory.TEST_RUN))) == ForegroundRun(30, True)
    assert limit().decide(1, line(part("make", CommandCategory.BUILD))) == ForegroundRun(30, True)


def test_a_command_whose_last_run_went_past_the_limit_goes_to_the_background_at_once():
    assert limit(went_past=True).decide(1, line(part("ls", CommandCategory.SEARCH))) == ForegroundRun(30, True)


def test_any_other_line_gets_the_foreground_seconds_and_fewer_while_a_message_waits():
    assert limit().decide(1, line(part("ls", CommandCategory.SEARCH))) == ForegroundRun(30, False)
    assert limit(waiting=True).decide(1, line(part("ls", CommandCategory.SEARCH))) == ForegroundRun(10, False)
