from core.base.database.statement import Statement


def test_joining_statements_keeps_their_parameters_in_order():
    joined = Statement("SELECT * FROM tasks WHERE state = ?", ["open"]).joined(Statement("AND id > ?", [12]))
    assert joined == Statement("SELECT * FROM tasks WHERE state = ? AND id > ?", ("open", 12))


def test_many_statements_join_with_a_separator_and_keep_their_parameters_in_order():
    joined = Statement.all_joined((Statement("a = ?", [1]), Statement("b = ?", [2]), Statement("c IS NULL")), " AND ")
    assert joined == Statement("a = ? AND b = ? AND c IS NULL", (1, 2))
