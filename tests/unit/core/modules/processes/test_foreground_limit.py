from core.base.driver.classification import Classification
from core.base.driver.command_category import CommandCategory
from core.base.driver.part import Part
from core.base.driver.shell_line import ShellLine
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.support.foreground_limit import ForegroundLimit
from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.support.part_command import PartCommand


class Settings:
    def integer(self, setting: ProcessSetting, environment_id: int) -> int:
        return setting.default


class Background:
    def __init__(self, journal_commands: bool = False) -> None:
        self.journal_commands = journal_commands

    def includes(self, shell: ShellLine) -> bool:
        return self.journal_commands

    def alias_runs(self, shell: ShellLine) -> list[object]:
        return []

    def alias_names(self, shell: ShellLine) -> tuple[str, ...]:
        return ()

    def declared_category(self, shell: ShellLine) -> None:
        return None

    def part_command(self, part: Part) -> PartCommand:
        return PartCommand(part.text)


class CategoryBackground(Background):
    def declared_category(self, shell: ShellLine) -> CommandCategory:
        return CommandCategory.TEST_RUN


class Rows:
    """Stands in for the process and message queries: whether the line went past the limit and whether a
    message waits."""

    def __init__(self, over_limit: bool = False, waiting: bool = False) -> None:
        self.over_limit, self.waiting = over_limit, waiting

    def has_moved_run(self, environment_id: int, text: str, seconds: int = 0) -> bool:
        return self.over_limit


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


def line(*parts: Part, journal_shell: bool = False) -> ShellLine:
    return ShellLine(" && ".join(item.text for item in parts), tuple(parts), (), journal_shell, "")


def limit(over_limit: bool = False, waiting: bool = False, journal_commands: bool = False) -> ForegroundLimit:
    return ForegroundLimit(Settings(), Background(journal_commands), Rows(over_limit), Messages(waiting))  # type: ignore[arg-type]


def test_a_journal_only_line_has_no_limit_to_move_at():
    assert limit().decide(1, line(part("journal", CommandCategory.JOURNAL), journal_shell=True)) == ForegroundRun(0, False, part_commands=tuple([PartCommand("journal")]))


def test_a_journal_line_never_goes_to_the_background():
    assert limit(journal_commands=True).decide(1, line(part("journal", CommandCategory.JOURNAL), journal_shell=True)) == ForegroundRun(0, False, part_commands=tuple([PartCommand("journal")]))


def test_a_test_run_and_a_build_run_in_line_up_to_the_foreground_seconds():
    assert limit().decide(1, line(part("pytest", CommandCategory.TEST_RUN))).seconds == 15
    assert not limit().decide(1, line(part("pytest", CommandCategory.TEST_RUN))).background
    assert not limit().decide(1, line(part("make", CommandCategory.BUILD))).background


def test_a_test_run_gets_fewer_seconds_while_a_message_waits():
    assert limit(waiting=True).decide(1, line(part("pytest", CommandCategory.TEST_RUN))).seconds == 10


def test_a_test_run_that_went_past_the_limit_before_goes_to_the_background_at_once():
    assert limit(over_limit=True).decide(1, line(part("pytest", CommandCategory.TEST_RUN))).background


def test_a_command_whose_last_run_went_past_the_limit_goes_to_the_background_at_once():
    assert limit(over_limit=True).decide(1, line(part("ls", CommandCategory.SEARCH))).background


def test_any_other_line_gets_the_foreground_seconds_and_fewer_while_a_message_waits():
    assert limit().decide(1, line(part("ls", CommandCategory.SEARCH))).seconds == 15
    assert limit(waiting=True).decide(1, line(part("ls", CommandCategory.SEARCH))).seconds == 10


def test_only_test_runs_and_builds_are_named_for_stripping():
    chain = line(part("cat", CommandCategory.READ), part("pytest", CommandCategory.TEST_RUN), part("make", CommandCategory.BUILD), part("git", CommandCategory.VERSION_CONTROL), part("mypy", CommandCategory.CHECK))
    assert limit().decide(1, chain).stripped == ("pytest", "make")


def test_a_line_with_no_test_or_build_names_nothing_to_strip():
    assert limit().decide(1, line(part("sed", CommandCategory.EDIT))).stripped == ()


def test_a_test_or_build_stores_more_output_than_any_other_line():
    assert limit().decide(1, line(part("pytest", CommandCategory.TEST_RUN))).most_output_bytes == 100 << 20
    assert limit().decide(1, line(part("ls", CommandCategory.SEARCH))).most_output_bytes == 10 << 20


def test_a_line_declared_as_a_test_is_named_for_stripping_and_stores_as_much():
    declared = limit()
    declared.background = CategoryBackground()
    run = declared.decide(1, line(part("sins", CommandCategory.UNKNOWN)))
    assert run.stripped == tuple(["sins"])
    assert run.most_output_bytes == 100 << 20


def test_a_chain_with_a_test_stores_as_much_as_a_test():
    assert limit().decide(1, line(part("ls", CommandCategory.SEARCH), part("pytest", CommandCategory.TEST_RUN))).most_output_bytes == 100 << 20
