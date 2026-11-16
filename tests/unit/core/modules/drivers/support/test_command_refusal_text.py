from core.modules.drivers.support.command_refusal_text import CommandRefusalText
from engine.helper_type.command_allow_list import CommandAllowList
from engine.helper_type.enums.journal_line_class import JournalLineClass
from engine.helper_type.journal_line import JournalLine

SETTING_SET = JournalLine("setting set", frozenset([JournalLineClass.CHANGES, JournalLineClass.EXTERNAL]))


def test_the_refusal_names_the_line_and_the_groups_and_lines_the_type_runs_and_nothing_else():
    commands = CommandAllowList(groups=("proof", "worker"), lines=("task show", "task log"))
    assert CommandRefusalText("Worker", commands).agent_message(SETTING_SET).text == ("A worker may not run setting set: it runs the groups proof, worker and the lines "
                                                                          "task show, task log; ask your main agent")


def test_a_type_that_lists_no_group_says_so():
    assert "the groups none" in CommandRefusalText("Reader", CommandAllowList(lines=("task show",))).agent_message(SETTING_SET).text
