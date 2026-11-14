from engine.enums.command_category import CommandCategory
from engine.helper_type.enums.journal_line_class import JournalLineClass
from engine.helper_type.journal_line import JournalLine
from suites.coding.modules.workers.types.merger import Merger
from suites.coding.modules.workers.types.worker import Worker

PROOF_LINE = JournalLine("proof make", frozenset([JournalLineClass.CHANGES, JournalLineClass.OUTWARD]))
SETTING_SET = JournalLine("setting set", frozenset([JournalLineClass.CHANGES, JournalLineClass.OUTWARD]))


def test_a_worker_runs_its_proofs_and_task_lines_and_is_refused_a_setting():
    assert Worker.commands.allows(PROOF_LINE) and Worker.commands.allows(JournalLine("task show", frozenset([JournalLineClass.READS])))
    assert not Worker.commands.allows(SETTING_SET)


def test_a_worker_keeps_the_shell_categories_the_setting_gave_it():
    assert Worker.commands.categories == (CommandCategory.READ, CommandCategory.SEARCH, CommandCategory.EDIT, CommandCategory.CHECK, CommandCategory.TEST_RUN, CommandCategory.BUILD)


def test_the_merger_runs_its_merger_lines_beside_every_line_a_read_only_helper_runs():
    assert Merger.commands.allows(JournalLine("merger merge", frozenset([JournalLineClass.CHANGES])))
    assert Merger.commands.allows(JournalLine("doc make", frozenset([JournalLineClass.CHANGES]))) and not Merger.commands.allows(SETTING_SET)
