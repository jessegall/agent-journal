from core.modules.helpers.types.helper import Helper
from core.modules.drivers.support.reviewer_commands import ReviewerCommands
from engine.helper_type.enums.journal_line_class import JournalLineClass
from engine.helper_type.journal_line import JournalLine

EXTERNAL_READ = JournalLine("message feed", frozenset([JournalLineClass.READS, JournalLineClass.EXTERNAL]))
TASK_EDIT = JournalLine("task edit", frozenset([JournalLineClass.CHANGES]))
TASK_CLOSE = JournalLine("task close", frozenset([JournalLineClass.CHANGES]))


def test_a_read_only_helper_reads_every_line_that_stays_in_the_journal_and_no_external_one():
    assert JournalLineClass.EXTERNAL not in Helper.commands.classes
    assert Helper.commands.allows(JournalLine("task show", frozenset([JournalLineClass.READS]))) and not Helper.commands.allows(EXTERNAL_READ)
    assert not Helper.commands.allows(TASK_CLOSE)


def test_the_reviewer_profile_narrows_the_helper_and_records_its_review():
    reviewer = ReviewerCommands()
    assert Helper.commands.widened_names(reviewer) == ()
    assert reviewer.allows(JournalLine("review record", frozenset([JournalLineClass.CHANGES, JournalLineClass.EXTERNAL]))) and not reviewer.allows(TASK_EDIT)


def test_the_reviewer_profile_files_a_report_and_no_document():
    reviewer = ReviewerCommands()
    assert reviewer.allows(JournalLine("report make", frozenset([JournalLineClass.CHANGES]))) and not reviewer.allows(JournalLine("doc make", frozenset([JournalLineClass.CHANGES])))


def test_the_reviewer_profile_weighs_and_skips_its_memory_marks():
    reviewer = ReviewerCommands()
    assert reviewer.allows(JournalLine("memory skip", frozenset([JournalLineClass.CHANGES]))) and reviewer.allows(JournalLine("memory weigh", frozenset([JournalLineClass.CHANGES])))
