from core.base.database.statement import Statement
from core.base.query.conditions.equal import Equal
from core.base.query.conditions.subquery_match import SubqueryMatch
from core.base.query.conditions.is_null import IsNull
from core.base.query.select import Select


def test_a_bare_select_reads_the_whole_table():
    assert Select("tasks").statement() == Statement("SELECT * FROM tasks")


def test_each_clause_adds_to_the_statement():
    select = Select("tasks").matching(Equal("state", "open")).matching(IsNull("closed_at")).ordered("id", True).sliced(50, 100)
    assert select.statement() == Statement("SELECT * FROM tasks WHERE state = ? AND closed_at IS NULL ORDER BY id DESC LIMIT 50 OFFSET 100", ("open",))


def test_a_clause_leaves_the_select_it_was_added_to_as_it_was():
    plain = Select("tasks")
    plain.matching(Equal("state", "open"))
    assert plain.statement() == Statement("SELECT * FROM tasks")


def test_count_and_exists_keep_the_conditions_and_drop_order_and_page():
    select = Select("tasks").matching(Equal("state", "open")).ordered("id", True).sliced(50, 0)
    assert select.count_statement() == Statement("SELECT count(*) FROM tasks WHERE state = ?", ("open",))
    assert select.exists_statement() == Statement("SELECT 1 FROM tasks WHERE state = ? LIMIT 1", ("open",))


def test_one_select_can_filter_by_another():
    placed = Select("phase_tasks").column("task_id").matching(Equal("phase_id", 3))
    statement = Select("tasks").matching(SubqueryMatch("id", placed)).statement()
    assert statement == Statement("SELECT * FROM tasks WHERE id IN (SELECT task_id FROM phase_tasks WHERE phase_id = ?)", (3,))
