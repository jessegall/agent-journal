from core.modules.helpers.types.helper import Helper
from core.modules.drivers.support.reviewer_commands import ReviewerCommands
from engine.helper_type.enums.journal_line_class import JournalLineClass
from engine.helper_type.journal_line import JournalLine

OUTWARD_READ = JournalLine("message feed", frozenset([JournalLineClass.READS, JournalLineClass.OUTWARD]))
TASK_EDIT = JournalLine("task edit", frozenset([JournalLineClass.CHANGES]))
TASK_CLOSE = JournalLine("task close", frozenset([JournalLineClass.CHANGES]))


def test_a_read_only_helper_reads_every_line_that_stays_in_the_journal_and_no_outward_one():
    assert JournalLineClass.OUTWARD not in Helper.commands.classes
    assert Helper.commands.allows(JournalLine("task show", frozenset([JournalLineClass.READS]))) and not Helper.commands.allows(OUTWARD_READ)
    assert not Helper.commands.allows(TASK_CLOSE)


def test_the_reviewer_profile_narrows_the_helper_and_records_its_review():
    reviewer = ReviewerCommands()
    assert Helper.commands.widened_names(reviewer) == ()
    assert reviewer.allows(JournalLine("review record", frozenset([JournalLineClass.CHANGES, JournalLineClass.OUTWARD]))) and not reviewer.allows(TASK_EDIT)
