import sqlite3

from core.modules.approvals.migrations.m001_approval_requests import ApprovalRequestsMigration
from core.modules.approvals.migrations.m002_approval_recipients import ApprovalRecipientsMigration


def test_upgrade_addresses_helpers_to_main_and_closes_old_task_wait_approvals():
    connection = sqlite3.connect(":memory:")
    try:
        connection.executescript("CREATE TABLE actors(id INTEGER PRIMARY KEY);"
                                 "CREATE TABLE environments(id INTEGER PRIMARY KEY);"
                                 "CREATE TABLE agents(id INTEGER PRIMARY KEY, role TEXT, environment_id INTEGER);"
                                 "INSERT INTO actors VALUES(1),(2); INSERT INTO environments VALUES(1);"
                                 "INSERT INTO agents VALUES(1,'main',1),(2,'helper',1);")
        for sql in ApprovalRequestsMigration.statements:
            connection.execute(sql)
        connection.executemany("INSERT INTO approvals(id,environment_id,creator_id,requester_id,text,arguments,created_at,updated_at)"
                               " VALUES(?,1,2,2,'Question',?,'2026','2026')", [(1, '["phone","pair"]'), (2, '["task","unblock","8"]')])
        for sql in ApprovalRecipientsMigration.statements:
            connection.execute(sql)
        assert connection.execute("SELECT recipient_agent_id,state FROM approvals ORDER BY id").fetchall() == [(1, "open"), (1, "closed")]
    finally:
        connection.close()
