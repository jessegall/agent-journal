from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration

PREFIXED_ITEM_SQL = "CASE WHEN item.value LIKE 'journal %' THEN item.value ELSE 'journal ' || item.value END"


class OverviewWholeLines(Migration):
    """The overview's commands are whole lines since any command may stand there: every line saved before, a journal line without its first word, gains journal, and one still naming the plan or the task in hand by a placeholder names it current."""

    number: ClassVar[int] = 38

    def apply(self, connection: Connection) -> None:
        connection.execute(
            f"UPDATE settings SET value = (SELECT json_group_array(replace(replace({PREFIXED_ITEM_SQL}, '{{{{started_plan}}}}', 'current'), '{{{{task_in_hand}}}}', 'current')) "
            "FROM json_each(settings.value) AS item) WHERE key = 'briefing.look_commands' AND json_valid(value)"
        )
