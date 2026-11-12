from dataclasses import dataclass

from engine.driver.classification import Classification
from engine.enums.command_category import CommandCategory
from engine.driver.part import Part
from engine.driver.shell_line import ShellLine
from core.modules.processes.models.enums.process_setting import ProcessSetting
from core.modules.processes.support.foreground_limit import ForegroundLimit
from core.modules.processes.support.part_command import PartCommand
from core.modules.processes.support.run_waits import RunWaits


class Settings:
    def integer(self, setting: ProcessSetting) -> int:
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

    def part_command(self, part: Part, shell: ShellLine) -> PartCommand:
        return PartCommand(part.text, part.classification.category)

    def is_long_alias(self, part: Part, shell: ShellLine) -> bool:
        return False


@dataclass(frozen=True)
class AliasRun:
    reader_id: int | None


class CategoryBackground(Background):
    def declared_category(self, shell: ShellLine) -> CommandCategory:
        return CommandCategory.TEST_RUN

    def is_long_alias(self, part: Part, shell: ShellLine) -> bool:
        return True


class Rows:
    """Stands in for the process and message queries: whether the line went past the limit and whether a
    message waits."""

    def __init__(self, excess: bool = False, waiting: bool = False) -> None:
        self.excess, self.waiting = excess, waiting

    def has_moved_run(self, text: str, seconds: int = 0) -> bool:
        return self.excess


class Messages:
    def __init__(self, waiting: bool) -> None:
        self.waiting = waiting

    def unread(self, agent_id: int) -> "Messages":
        return self

    def exists(self) -> bool:
        return self.waiting


def part(program: str, category: CommandCategory) -> Part:
    return Part(program, program, "", (), Classification(category, ()), (), (), "", None)


def line(*parts: Part, journal_shell: bool = False) -> ShellLine:
    return ShellLine(" && ".join(item.text for item in parts), tuple(parts), (), journal_shell, "")


def limit(excess: bool = False, waiting: bool = False, journal_commands: bool = False) -> ForegroundLimit:
    return ForegroundLimit(Settings(), Background(journal_commands), Rows(excess), Messages(waiting), RunWaits())  # type: ignore[arg-type]


def test_a_journal_only_line_has_no_foreground_limit():
    assert limit().decide(line(part("journal", CommandCategory.JOURNAL), journal_shell=True), 1).seconds == 0


def test_a_journal_line_that_declares_the_background_runs_there_with_no_foreground_limit():
    assert limit(journal_commands=True).decide(line(part("journal", CommandCategory.JOURNAL), journal_shell=True), 1).background


def test_a_test_run_and_a_build_run_in_line_up_to_the_foreground_seconds():
    assert limit().decide(line(part("pytest", CommandCategory.TEST_RUN)), 1).seconds == 15
    assert not limit().decide(line(part("pytest", CommandCategory.TEST_RUN)), 1).background
    assert not limit().decide(line(part("make", CommandCategory.BUILD)), 1).background


def test_a_test_run_gets_fewer_seconds_while_a_message_waits():
    assert limit(waiting=True).decide(line(part("pytest", CommandCategory.TEST_RUN)), 1).seconds == 10


def test_a_test_run_that_went_past_the_limit_before_goes_to_the_background_at_once():
    assert limit(excess=True).decide(line(part("pytest", CommandCategory.TEST_RUN)), 1).background


def test_a_pipe_that_ran_after_a_long_command_sends_no_quick_test_to_the_background():
    head = Part("pytest", "pytest", "", (), Classification(CommandCategory.TEST_RUN, ()), (), (), "", 1)
    rows = Rows(excess=False)
    rows.has_moved_run = lambda text, seconds=0: text == "tail"
    decided = ForegroundLimit(Settings(), Background(), rows, Messages(False), RunWaits()).decide(line(head, part("tail", CommandCategory.READ)), 1)  # type: ignore[arg-type]
    assert not decided.background


def test_file_commands_run_at_once_and_never_move_to_the_background_after_a_long_run():
    decided = limit(excess=True).decide(line(part("grep", CommandCategory.SEARCH), part("cut", CommandCategory.READ), part("sed", CommandCategory.EDIT)), 1)
    assert not decided.background and decided.seconds == 0


def test_any_other_line_gets_the_foreground_seconds_and_fewer_while_a_message_waits():
    assert limit().decide(line(part("pytest", CommandCategory.TEST_RUN)), 1).seconds == 15
    assert limit(waiting=True).decide(line(part("pytest", CommandCategory.TEST_RUN)), 1).seconds == 10


def test_a_test_or_build_stores_more_output_than_any_other_line():
    assert limit().decide(line(part("pytest", CommandCategory.TEST_RUN)), 1).most_output_bytes == 100 << 20
    assert limit().decide(line(part("ls", CommandCategory.SEARCH)), 1).most_output_bytes == 10 << 20


def test_a_line_declared_as_a_test_stores_as_much():
    declared = limit()
    declared.background = CategoryBackground()
    assert declared.decide(line(part("sins", CommandCategory.UNKNOWN)), 1).most_output_bytes == 100 << 20


def test_two_saved_commands_with_different_readers_leave_the_run_no_reader_of_its_own():
    run_limit = limit()
    run_limit.background.alias_runs = lambda shell: [AliasRun(1), AliasRun(2)]
    assert run_limit.decide(line(part("pytest", CommandCategory.TEST_RUN)), 1).reader_id is None


def test_two_saved_commands_with_one_reader_share_it():
    run_limit = limit()
    run_limit.background.alias_runs = lambda shell: [AliasRun(1), AliasRun(1)]
    assert run_limit.decide(line(part("pytest", CommandCategory.TEST_RUN)), 1).reader_id == 1


def test_a_chain_with_a_test_stores_as_much_as_a_test():
    assert limit().decide(line(part("ls", CommandCategory.SEARCH), part("pytest", CommandCategory.TEST_RUN)), 1).most_output_bytes == 100 << 20
