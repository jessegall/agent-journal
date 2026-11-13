from engine.query.conditions.condition_join import ConditionJoin
from engine.query.conditions.any_of import AnyOf
from engine.query.conditions.column_compare import ColumnCompare
from engine.query.conditions.equal import Equal
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.enums.sql_function import SqlFunction
from engine.query.expressions.aliased import Aliased
from engine.query.expressions.column import Column
from engine.query.expressions.concat import Concat
from engine.query.expressions.function_call import FunctionCall
from engine.query.expressions.json_each import JsonEach
from engine.query.expressions.literal import Literal
from engine.query.expressions.scalar_subselect import ScalarSubselect
from engine.query.select import Select

COMMENTED_ROW_PATH = '$."journal.core.messages".commented_row'
CHAT_MESSAGE_COLUMNS = ("id", "environment_id", "parent_id", "type", "text", "read_at", "files", "captions", "reactions", "flowchart_edges", "peer", "recipient")
MARK_COLUMNS = ("id", "environment_id", "session_agent_id", "type", "variant")
MARK_DETAIL_COLUMNS = ("text", "detail", "lines", "target_model", "target_id", "outcome", "figure", "fraction", "run_key", "run_step", "state", "ended_at",
                       "created_at")


def commented(part: str) -> FunctionCall:
    return FunctionCall(SqlFunction.JSON_EXTRACT, [Column("metadata"), Literal(f"{COMMENTED_ROW_PATH}.{part}")])


COMMENTED_LINK = ScalarSubselect(
    Select("links").selecting(Concat([Column("target_model"), Literal(":"), Column("target_id")])).matching(Equal("source_model", "message"))
    .matching(ColumnCompare("source_id", "=", "messages.id")).matching(Equal("link_type", "comments_on")).ordered("id", False).sliced(1, 0))
COMMENTED_ROW = Aliased(FunctionCall(SqlFunction.COALESCE, [Concat([commented("model"), Literal(":"), commented("id")]), COMMENTED_LINK, Literal("")]),
                        "commented_row")

CHAT_MESSAGES_SELECT = Select("messages").selecting(
    *(Column(name) for name in CHAT_MESSAGE_COLUMNS), COMMENTED_ROW, Column("session_agent_id"), Column("target_agent_id"), Column("created_at"),
).matching(Equal("is_chat_visible", 1)).view_sql()

MAIN_CHAT_MARKS_SELECT = Select("chat_marks").selecting(
    *(Column(name) for name in MARK_COLUMNS), Aliased(Column("key"), "mark_key"), *(Column(name) for name in MARK_DETAIL_COLUMNS),
).matching(AnyOf([IsNull("session_agent_id"), SubqueryMatch("session_agent_id", Select("agents").selecting(Column("id")).matching(Equal("role", "main")))])
           ).view_sql()

ATTACHED_FILES_SELECT = Select("messages").selecting(
    Aliased(Concat([Column("messages.id"), Literal(":"), Column("file.key")]), "row_key"),
    Aliased(Column("messages.id"), "message_id"), Aliased(Column("messages.environment_id"), "environment_id"), Aliased(Column("file.value"), "name"),
    Aliased(Column("messages.text"), "message_text"), Aliased(Column("messages.created_at"), "created_at"),
).joined(ConditionJoin(JsonEach(Column("messages.files")), alias="file")).view_sql()
