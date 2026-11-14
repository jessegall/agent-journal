import sqlite3

import pytest

from engine.database.statement import Statement


def test_the_assign_rules_module_creates_its_three_tables(journal):
    names = {row["name"] for row in journal.database.rows(Statement("SELECT name FROM sqlite_master WHERE type = 'table'", []))}
    assert {"assign_rules", "assign_rule_conditions", "assign_decisions"} <= names


def test_a_task_has_one_decision_which_can_be_updated(journal):
    task_id = journal.new_row_id('task make "Fix the cart" --brief "Totals in cents"')
    insert = Statement("INSERT INTO assign_decisions (version, created_at, updated_at, task_id, outcome) VALUES (1, 'now', 'now', ?, 'unmatched')", [task_id])
    journal.database.insert(insert)
    with pytest.raises(sqlite3.IntegrityError):
        journal.database.insert(insert)
    assert journal.database.update(Statement("UPDATE assign_decisions SET outcome = 'skipped' WHERE task_id = ?", [task_id])) == 1
