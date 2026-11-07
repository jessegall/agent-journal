import sqlite3
from pathlib import Path

from tests.stories.fixtures.version_four import STAMP, USER

RECOVERY_HELPERS = (
    (101, "worker", "Ada Dispatch", "dispatched", True),
    (102, "worker", "Grace Code", "clocked in", True),
    (103, "worker", "Turing Report", "reported", True),
    (104, "worker", "Dijkstra Merge", "clocked out", True),
    (105, "worker", "Lovelace Stop", "stopped", True),
    (106, "worker", "Curie Limit", "waiting for the usage limit", True),
    (107, "worker", "Hopper Return", "ended without clocking out", True),
    (108, "worker", "Babbage Review", "unknown legacy state", True),
    (109, "worker", "Knuth Merge", "merged", False),
    (110, "worker", "Shannon Release", "released", False),
    (111, "verifier", "Noether Check", "verifying", True),
    (112, "verifier", "Gauss Verdict", "ended without a verdict", True),
    (113, "verifier", "Euler Verdict", "judged", False),
)
HISTORY_COUNTS = {
    "sent_agents": len(RECOVERY_HELPERS) + 1,
    "worker_todos": 3,
    "proofs": 9,
    "subagents": 26,
    "plan_reviews": 6,
    "reader_reports": 167,
    "test_turns": 14,
}
CHECK_WAIT_COUNT = 9
UNMOVED_LINK_COUNT = 61


def recovery_brief(name: str) -> str:
    return f"Finish {name}'s task. Read the project instructions, preserve the existing behavior, and run the task's focused tests before delivering the complete change."


def prepare_worker_recovery(folder: Path) -> None:
    with sqlite3.connect(folder / "journal.db") as connection:
        connection.executemany(
            "INSERT INTO sent_agents (id, environment_id, name, brief, provider, model, session, helper_type, state, created_at, creator) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [(number, 1, name, recovery_brief(name), "claude", "sonnet", f"recovery-{number}", helper_type, state, STAMP, USER)
             for number, helper_type, name, state, _ in RECOVERY_HELPERS],
        )
        for table, expected in HISTORY_COUNTS.items():
            count = connection.execute(f"SELECT count(*) FROM {table}").fetchone()[0]
            connection.executemany(f"INSERT INTO {table} (created_at, creator) VALUES (?, ?)", [(STAMP, USER)] * (expected - count))
        connection.executemany(
            "INSERT INTO checks (title, command, wait_target, is_retired, created_at, creator) VALUES (?, ?, ?, ?, ?, ?)",
            [(f"Legacy wait {number}", "true", 1, 0, STAMP, USER) for number in range(CHECK_WAIT_COUNT - 1)],
        )
        connection.executemany(
            "INSERT INTO links (source, target, link_type, created_at, creator) VALUES (?, ?, ?, ?, ?)",
            [("docs:1", f"worker_todos:{number}", "about", STAMP, USER) for number in range(1, UNMOVED_LINK_COUNT)],
        )


def backup_history_counts(database: Path) -> dict[str, int]:
    with sqlite3.connect(f"{database.resolve().as_uri()}?mode=ro", uri=True) as connection:
        return {table: connection.execute(f"SELECT count(*) FROM {table}").fetchone()[0] for table in HISTORY_COUNTS}
