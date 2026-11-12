import pytest

from engine.query.condition_join import ConditionJoin
from engine.query.conditions.among import Among
from engine.query.conditions.equal import Equal
from engine.query.conditions.exists import Exists
from engine.query.enums.comparison_operator import ComparisonOperator
from engine.query.enums.sql_function import SqlFunction
from engine.query.errors.unnamed_expression_error import UnnamedExpressionError
from engine.query.expressions.aliased import Aliased
from engine.query.expressions.case_when import CaseWhen
from engine.query.expressions.cast_integer import CastInteger
from engine.query.expressions.column import Column
from engine.query.expressions.comparison import Comparison
from engine.query.expressions.concat import Concat
from engine.query.expressions.count_all import CountAll
from engine.query.expressions.function_call import FunctionCall
from engine.query.expressions.inlined import Inlined
from engine.query.expressions.json_each import JsonEach
from engine.query.expressions.json_list import JsonList
from engine.query.expressions.json_path import JsonPath
from engine.query.expressions.lag import Lag
from engine.query.expressions.literal import Literal
from engine.query.expressions.negation import Negation
from engine.query.expressions.scalar_subselect import ScalarSubselect
from engine.query.order import Order
from engine.query.select import Select

"""Task 9143: each expression the views need writes its SQL text, with its values written in, in order."""


@pytest.mark.parametrize("value,text", [(None, "NULL"), (True, "1"), (0, "0"), (1.5, "1.5"), ("it's", "'it''s'")])
def test_a_literal_writes_its_value_quoted(value, text):
    assert Literal(value).sql() == text


def test_a_column_and_an_alias_are_plain_names():
    assert Aliased(Column("tasks.id"), "task_id").sql() == "tasks.id AS task_id"
    assert Column("active_memories.*").sql() == "active_memories.*"
    with pytest.raises(UnnamedExpressionError):
        Column("id; DROP TABLE tasks")
    with pytest.raises(UnnamedExpressionError):
        Aliased(Column("id"), "a b")


def test_a_function_call_writes_its_arguments_in_order():
    assert FunctionCall(SqlFunction.COALESCE, [FunctionCall(SqlFunction.NULLIF, [Column("given_name"), Literal("")]), Literal("Agent")]).sql() \
        == "coalesce(nullif(given_name, ''), 'Agent')"
    assert FunctionCall(SqlFunction.JSON_GROUP_ARRAY, [Column("role")], distinct=True).sql() == "json_group_array(DISTINCT role)"
    assert CountAll().sql() == "count(*)"


def test_text_joined_end_to_end():
    assert Concat([Literal("doc:"), Column("id")]).sql() == "('doc:' || id)"


def test_a_comparison_and_its_opposite():
    assert Comparison(Column("agents.role"), ComparisonOperator.EQUAL, Literal("main")).sql() == "(agents.role = 'main')"
    assert Negation(Equal("state", "open")).sql() == "NOT (state = 'open')"


def test_a_condition_is_written_with_its_values_in_place():
    assert Inlined(Among("state", ["running", "background"])).text() == "state IN ('running', 'background')"


def test_a_case_writes_its_branches_and_otherwise():
    case = CaseWhen([(Equal("tasks.state", "cancelled"), Literal("cancelled"))], Literal("completed"))
    assert case.sql() == "CASE WHEN (tasks.state = 'cancelled') THEN 'cancelled' ELSE 'completed' END"
    assert CaseWhen([(Equal("role", "main"), Column("id"))]).sql() == "CASE WHEN (role = 'main') THEN id ELSE NULL END"


def test_a_scalar_subselect_and_exists_write_their_select():
    newest = Select("hook_calls").selecting(Column("hook_calls.created_at")).matching(Equal("hook_calls.hook", "tick", negated=True)).ordered("hook_calls.id", True).sliced(1, 0)
    assert ScalarSubselect(newest).sql() == "(SELECT hook_calls.created_at FROM hook_calls WHERE hook_calls.hook IS NOT 'tick' ORDER BY hook_calls.id DESC LIMIT 1)"
    assert Inlined(Exists(Select("agents").matching(Equal("role", "main")))).sql() == "(EXISTS (SELECT 1 FROM agents WHERE role = 'main'))"


def test_cast_substring_json_and_window_expressions():
    assert CastInteger(FunctionCall(SqlFunction.SUBSTR, [Column("target"), Literal(7)])).sql() == "CAST(substr(target, 7) AS INTEGER)"
    assert JsonPath(Column("payload"), "$.body").sql() == "payload -> '$.body'"
    assert JsonList(Column("word")).sql() == "coalesce('[' || group_concat(json_quote(word)) || ']', '[]')"
    assert Lag(Column("day"), Order("id", True)).sql() == "lag(day) OVER (ORDER BY id DESC)"
    assert JsonEach(Column("registry.entries"), "$.helper_types").sql() == "json_each(registry.entries, '$.helper_types')"


def test_a_select_of_expressions_with_an_alias_a_join_a_group_and_a_union():
    counts = Select("memories").selecting(Column("agent_id"), Aliased(FunctionCall(SqlFunction.SUM, [Comparison(Column("state"), ComparisonOperator.EQUAL, Literal("active"))]), "active_memories")).grouped("agent_id")
    holders = Select("agents").selecting(Column("agents.id"), Column("counts.active_memories")).joined(
        ConditionJoin(ScalarSubselect(counts), condition=Comparison(Column("counts.agent_id"), ComparisonOperator.EQUAL, Column("agents.id")), alias="counts"))
    assert holders.view_sql() == ("SELECT agents.id, counts.active_memories FROM agents JOIN (SELECT agent_id, sum((state = 'active')) AS active_memories"
                                  " FROM memories GROUP BY agent_id) AS counts ON (counts.agent_id = agents.id)")
    rows = Select("docs").selecting(Column("id")).union(Select("reports").selecting(Column("id"))).union(Select("dumps").selecting(Column("id")), every=False)
    assert rows.view_sql() == "SELECT id FROM docs UNION ALL SELECT id FROM reports UNION SELECT id FROM dumps"
    assert Select("worker_worktrees").named_as("worktree").selecting(Column("worktree.id")).view_sql() == "SELECT worktree.id FROM worker_worktrees AS worktree"
    latest = Select("task_logs").selecting(Column("id")).ordered("id", True).sliced(100, 0)
    assert Select("latest").reading(ScalarSubselect(latest)).named_as("latest").selecting(CountAll()).view_sql() \
        == "SELECT count(*) FROM (SELECT id FROM task_logs ORDER BY id DESC LIMIT 100) AS latest"


def test_a_join_without_a_condition_pairs_every_row():
    files = Select("messages").selecting(Column("file.value")).joined(ConditionJoin(JsonEach(Column("messages.files")), alias="file"))
    assert files.view_sql() == "SELECT file.value FROM messages JOIN json_each(messages.files) AS file"
