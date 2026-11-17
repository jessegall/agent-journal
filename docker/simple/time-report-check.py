# Times version 4's check for reports nobody acted on, on a copy of this container's record filled to the size of a
# large one (232,000 messages, 300 unread reports, each linked from three chat cards), first with the lookup as it
# was and then as the journal does it now, and says whether both found the same reports.
# Run it in the container: docker exec journal-v4-simple python3 /opt/agent-journal/time-report-check.py
import json
import shutil
import sqlite3
import sys
import time
from pathlib import Path

SOURCE = Path("/data/project/.journal")
DEMO = Path("/tmp/report-check-demo")
MESSAGES = int(sys.argv[1]) if len(sys.argv) > 1 else 232_000
REPORTS = 300
CARD_EVERY = 50
NOW = "2026-11-17T12:00:00+00:00"

sys.path.insert(0, str(SOURCE / "src"))
from journal.app import App  # noqa: E402
from journal.config import Config  # noqa: E402
from journal.db.condition import Condition  # noqa: E402
from journal.db.query import Query  # noqa: E402
from journal.repositories.reports import Reports  # noqa: E402
from journal.repositories.scope import Scope  # noqa: E402


def filled_copy() -> None:
    shutil.rmtree(DEMO, ignore_errors=True)
    (DEMO / ".journal").mkdir(parents=True)
    record = sqlite3.connect(DEMO / ".journal" / "journal.db")
    original = sqlite3.connect(SOURCE / "journal.db")
    original.backup(record)
    original.close()
    record.executemany("INSERT INTO messages (created_at, creator, updated_at, updater, environment_id, author, text, data) VALUES (?, 'user', ?, 'user', 1, 'user', 'a message', ?)",
                       ((NOW, NOW, json.dumps({"card_type": "moment"} if number % CARD_EVERY == 0 else {})) for number in range(MESSAGES)))
    first_report = record.execute("SELECT coalesce(max(id), 0) + 1 FROM reports").fetchone()[0]
    record.executemany("INSERT INTO reports (created_at, creator, updated_at, updater, environment_id, title, abstract, body, report_type, settled_reason) VALUES (?, 'agent', ?, 'agent', 1, 'A report', 'What was found', '', 'finding', '')",
                       ((NOW, NOW) for _ in range(REPORTS)))
    cards = [row[0] for row in record.execute("SELECT id FROM messages WHERE data LIKE '%card_type%' ORDER BY id DESC LIMIT ?", (REPORTS * 3,))]
    record.executemany("INSERT INTO links (created_at, creator, updated_at, updater, source, target, link_type) VALUES (?, 'agent', ?, 'agent', ?, ?, 'mentions')",
                       ((NOW, NOW, f"message:{card}", f"report:{first_report + index // 3}") for index, card in enumerate(cards)))
    record.commit()
    record.close()


def old_lookup(self, query, column):
    return self._with(Condition(f"{query.table}.{query._column(column).name} = ? || {self.table}.id", (f"{self.ref_name}:",)))


def timed(reports: Reports, scope: Scope) -> tuple[float, list[int]]:
    started = time.perf_counter()
    with scope.environment(1):
        found = [row.id for row in reports.unacted(0, REPORTS)]
    return time.perf_counter() - started, found


filled_copy()
app = App(Config.rooted(DEMO))
reports, scope = app.container.get(Reports), app.container.get(Scope)
new_lookup = Query.filter_name_column
Query.filter_name_column = old_lookup
old_seconds, old_found = timed(reports, scope)
Query.filter_name_column = new_lookup
new_seconds, new_found = timed(reports, scope)
print(f"{MESSAGES} messages, {REPORTS} unread reports, {REPORTS * 3} links from chat cards")
print(f"as it was: {old_seconds:.2f} s")
print(f"now:       {new_seconds:.3f} s")
print(f"same reports found both ways: {old_found == new_found} ({len(new_found)})")
