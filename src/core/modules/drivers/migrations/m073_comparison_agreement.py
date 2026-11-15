from engine.database.migration import Migration


class ComparisonAgreementMigration(Migration):
    """Marks as agreed the comparisons saved before agreement was recorded whose two answers tell the program the
    same: the same text, or a refusal or halt whose text after the deciding key is the same."""

    number = 73
    statements = ["UPDATE driver_comparisons SET difference_state = 'agreed' WHERE difference_state = 'unexplained' AND (old_answer = new_answer"
                  " OR (substr(old_answer, 1, 7) = substr(new_answer, 1, 7) AND instr(old_answer, ': ') > 0 AND instr(new_answer, ': ') > 0"
                  " AND substr(old_answer, instr(old_answer, ': ') + 2) = substr(new_answer, instr(new_answer, ': ') + 2)))"]
