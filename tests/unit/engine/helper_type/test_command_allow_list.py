from engine.enums.command_category import CommandCategory
from engine.helper_type.command_allow_list import CommandAllowList
from engine.helper_type.journal_line import JournalLine
from engine.helper_type.enums.journal_line_class import JournalLineClass

TASK_READ = JournalLine("task show", frozenset([JournalLineClass.READS]))
TASK_EDIT = JournalLine("task edit", frozenset([JournalLineClass.CHANGES]))
PROOF_LINE = JournalLine("proof make", frozenset([JournalLineClass.CHANGES, JournalLineClass.OUTWARD]))
SETTING_SET = JournalLine("setting set", frozenset([JournalLineClass.CHANGES, JournalLineClass.OUTWARD]))
WORKER_LIST = CommandAllowList(categories=tuple([CommandCategory.READ]), groups=tuple(["proof"]), lines=tuple(["task show"]))


def test_a_list_allows_a_line_by_its_group_by_the_line_itself_or_by_its_class():
    assert WORKER_LIST.allows(PROOF_LINE) and WORKER_LIST.allows(TASK_READ)
    assert CommandAllowList(classes=tuple([JournalLineClass.READS])).allows(TASK_READ)


def test_a_list_allows_a_shell_category_it_names_and_no_other():
    assert WORKER_LIST.allows_category(CommandCategory.READ) and not WORKER_LIST.allows_category(CommandCategory.NETWORK)


def test_a_line_passes_by_class_only_when_the_list_names_every_class_it_has():
    outward_read = JournalLine("message feed", frozenset([JournalLineClass.READS, JournalLineClass.OUTWARD]))
    assert not CommandAllowList(classes=tuple([JournalLineClass.READS])).allows(outward_read)
    assert CommandAllowList(classes=(JournalLineClass.READS, JournalLineClass.OUTWARD)).allows(outward_read)


def test_a_line_the_list_does_not_name_is_refused():
    assert not WORKER_LIST.allows(SETTING_SET) and not WORKER_LIST.allows(TASK_EDIT)
    assert not CommandAllowList().allows(TASK_READ)


def test_the_base_list_joins_the_list_of_a_type():
    base = CommandAllowList(lines=tuple(["message send"]))
    joined = base.joined(WORKER_LIST)
    assert joined.allows(JournalLine("message send", frozenset([JournalLineClass.CHANGES]))) and joined.allows(PROOF_LINE)
    assert joined.lines == ("message send", "task show")


def test_a_profile_narrows_its_type_and_never_widens_it():
    profile = CommandAllowList(groups=tuple(["proof", "setting"]), lines=tuple(["task show", "proof make", "plan make"]))
    kept = WORKER_LIST.intersection(profile)
    assert kept == CommandAllowList(groups=tuple(["proof"]), lines=("task show", "proof make"))
    assert WORKER_LIST.widened_names(profile) == ("setting", "plan make")


def test_a_compound_line_is_refused_whole_naming_its_refused_part():
    assert WORKER_LIST.refused_line([TASK_READ, SETTING_SET, TASK_EDIT]) == SETTING_SET
    assert WORKER_LIST.refused_line([TASK_READ, PROOF_LINE]) is None


def test_a_stored_list_reads_back_as_it_was_declared():
    stored = {"categories": ["read"], "groups": ["proof"], "lines": ["task show"], "classes": ["reads"]}
    assert CommandAllowList.restored(stored) == CommandAllowList(tuple([CommandCategory.READ]), tuple(["proof"]), tuple(["task show"]), tuple([JournalLineClass.READS]))
