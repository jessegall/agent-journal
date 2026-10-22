from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration

COMMON_COLUMNS = {'created_by': 'creator', 'updated_by': 'updater'}
TABLES = {
    "agents": {'context_mark': 'context_threshold', 'inbox_mark': 'inbox_position', 'mark_owed': 'threshold_due', 'oriented': 'has_overview', 'skills_owed': 'skills_due'},
    "checks": {'every': 'interval', 'last_ran_at': 'last_run_at', 'last_took': 'last_duration', 'running': 'progress', 'waited_on': 'wait_target'},
    "command_outputs": {'told': 'is_announced'},
    "dumps": {'chosen': 'choice', 'said': 'summary_text', 'taken': 'claimed'},
    "messages": {'read_mark': 'read_position', 'reply_to': 'reply_target'},
    "pairing_codes": {'until': 'expiry_time'},
    "phases": {'complete_when': 'completion_rule'},
    "phones": {'last_seen_at': 'last_visited_at', 'push': 'subscription', 'push_failed_at': 'subscription_failed_at'},
    "plans": {'blocked_why': 'block_reason'},
    "plugins": {'failing_since': 'failed_at', 'faults_in_a_row': 'fault_streak'},
    "secrets": {'asked_at': 'questioned_at', 'logging_in_at': 'login_started_at'},
    "sequences": {'finishes_in': 'end_condition', 'starts_on': 'trigger_event'},
    "tasks": {'blocked_why': 'block_reason', 'parked_why': 'suspension_reason'},
    "templates": {'applies_to': 'targets'},
    "workers": {'dispatched_by': 'dispatcher', 'found_session': 'recovered_session', 'taken_up': 'adopted'},
}


class ColumnRenames(Migration):
    """The columns renamed for the plain-name rules take their new names, so a row keeps its values; where the schema already added the new column empty, that empty column gives way and the old one is renamed into it, keeping its indexes."""

    number: ClassVar[int] = 24

    def apply(self, connection: Connection) -> None:
        tables = [row["name"] for row in connection.all("SELECT name FROM sqlite_master WHERE type = 'table'")]
        for table in tables:
            for old, new in {**COMMON_COLUMNS, **TABLES.get(table, {})}.items():
                self.column_rename(connection, table, old, new)
