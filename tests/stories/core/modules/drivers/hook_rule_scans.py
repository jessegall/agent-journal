from collections import defaultdict
from time import perf_counter

import pytest

from engine.database.database import Database
from engine.driver import driver_rules
from engine.testing.examples.hook_samples import HookSamples
from engine.driver.command_category import CommandCategory
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.drivers.hook_durations import UserBuilder
from tests.stories.support.story_checks import expect_value

MESSAGES = 30000
PROCESSES = 60000
RULE_SECONDS = 0.1
WATCHED_RULES = ("messages.delivery", "messages.unanswered", "processes.long-run-dock", "plugins.plugin-events")
SCANNED_INDEXES = ("messages_waiting", "messages_chat", "messages_environment_parent", "processes_environment_ended")
COUNTING = "WITH RECURSIVE c(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM c WHERE n < {count}) "
SHELL = HookSamples.shell("ls -la", ShellPart("ls", CommandCategory.READ, ["-la"]))


class RuleCalls:
    """The statements and seconds of each watched rule's calls, taken while hooks run."""

    def __init__(self, database: Database) -> None:
        self.database = database
        self.seconds: dict[str, list[float]] = defaultdict(list)
        self.statements: dict[str, set[str]] = defaultdict(set)

    def watch(self, monkeypatch) -> None:
        original = driver_rules.DriverRules.outcome

        def timed(rules, entry, hook):
            captured: list[str] = []
            self.database.connection.set_trace_callback(captured.append)
            started_at = perf_counter()
            outcome = original(rules, entry, hook)
            self.seconds[entry.name].append(perf_counter() - started_at)
            self.database.connection.set_trace_callback(None)
            self.statements[entry.name].update(sql for sql in captured if sql.startswith("SELECT"))
            return outcome

        monkeypatch.setattr(driver_rules.DriverRules, "outcome", timed)

    def plans(self, rule: str) -> list[str]:
        return [str(row[3]) for sql in self.statements[rule] for row in self.database.connection.execute(f"EXPLAIN QUERY PLAN {sql}")]


@pytest.fixture
def long_chat(new_story):
    story = new_story(fixture=UserBuilder)
    database = story.container.get(Database)
    connection = database.connection
    connection.execute("PRAGMA foreign_keys = OFF")
    connection.execute(COUNTING.format(count=MESSAGES) + "INSERT INTO messages (environment_id, creator_id, type, text, read_at, created_at, updated_at, target_agent_id, peer_key, delivered_at) "
                       "SELECT 1, 59, CASE WHEN n % 3 = 0 THEN 'agent' WHEN n % 3 = 1 THEN 'user' ELSE 'comment' END, 'old message ' || n, "
                       "CASE WHEN n % 3 = 0 OR n % 60 = 1 THEN NULL ELSE '2026-10-29T09:00:00.000000+00:00' END, '2026-10-30T09:00:00.000000+00:00', '2026-10-30T09:00:00.000000+00:00', "
                       "CASE WHEN n % 2 = 0 THEN 9999 END, '', CASE WHEN n % 60 = 1 THEN '2026-10-30T09:00:00.000000+00:00' END FROM c")
    connection.execute(f"INSERT INTO messages (environment_id, creator_id, type, text, created_at, updated_at, peer_key) VALUES (1, {story.agent.id}, 'agent', 'a recent reply', '2026-10-31T08:59:00.000000+00:00', '2026-10-31T08:59:00.000000+00:00', '')")
    connection.execute(COUNTING.format(count=PROCESSES) + "INSERT INTO processes (environment_id, session_agent_id, creator_id, line, folder, shell, category, limit_seconds, created_at, updated_at, started_at) "
                       f"SELECT 1, CASE WHEN n % 2 = 0 THEN {story.agent.id} ELSE 9999 END, 59, 'run ' || n, '/', 'zsh', 'read', 0, '2026-10-30T09:00:00.000000+00:00', '2026-10-30T09:00:00.000000+00:00', '2026-10-30T09:00:00.000000+00:00' FROM c")
    connection.execute("UPDATE processes SET state = 'finished', ended_at = '2026-10-30T09:00:01.000000+00:00' WHERE line LIKE 'run %'")
    connection.execute("PRAGMA foreign_keys = ON")
    return story, database


@pytest.fixture
def watched_hooks(long_chat, monkeypatch):
    story, database = long_chat
    calls = RuleCalls(database)
    calls.watch(monkeypatch)
    story.hook("s-1", SHELL)
    story.hook("s-1", HookSamples.stop())
    return calls


@pytest.mark.story_budget(cpu_seconds=20, reason="it fills the chat and the runs of one environment with tens of thousands of rows")
def test_no_hook_rule_reads_a_whole_table_on_a_journal_with_a_long_chat_and_many_runs(watched_hooks):
    scans = {rule: [plan for plan in watched_hooks.plans(rule) if any(index in plan for index in SCANNED_INDEXES)] for rule in WATCHED_RULES}
    expect_value({rule: plans for rule, plans in scans.items() if plans}, {})


@pytest.mark.story_budget(cpu_seconds=20, reason="it fills the chat and the runs of one environment with tens of thousands of rows")
def test_the_rules_that_ran_slowest_on_a_busy_server_answer_within_a_tenth_of_a_second_on_a_long_chat(watched_hooks):
    slowest = {rule: max(watched_hooks.seconds[rule]) for rule in WATCHED_RULES if watched_hooks.seconds[rule]}
    expect_value({rule: seconds for rule, seconds in slowest.items() if seconds >= RULE_SECONDS}, {})
    expect_value(sorted(slowest), sorted(WATCHED_RULES))
