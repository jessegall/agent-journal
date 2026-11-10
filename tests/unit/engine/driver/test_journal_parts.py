from engine.driver.classification import Classification
from engine.enums.command_category import CommandCategory
from engine.driver.part import Part
from engine.driver.shell_line import ShellLine


def command(program: str, *arguments: str) -> Part:
    return Part(" ".join((program, *arguments)), program, "", arguments, Classification(CommandCategory.UNKNOWN, ()), (), (), "", None)


def test_journal_parts_select_every_journal_command_or_only_the_requested_prefix():
    alias = command("journal", "viewer-test")
    task = command("journal", "task", "show", "7")
    external_command = command("echo", "journal")
    shell = ShellLine("", (alias, task, external_command), (), False, "")
    assert shell.parts_running_journal_command() == (alias, task)
    assert shell.parts_running_journal_command("task show") == tuple([task])
    assert shell.parts_running_journal_command("reader") == ()
