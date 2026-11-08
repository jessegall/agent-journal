import sqlite3
from pathlib import Path

# The version 4 tables the upgrade reads, with the columns version 4's Schema makes from its models (id, created_at, creator,
# updated_at, updater, then the model's own fields; a scoped row also holds environment_id). A creator is one string, kind:id:
# user:1, agent:s-1, system:. Built here, never from a live journal.
COMMON = "id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, creator TEXT, updated_at TEXT, updater TEXT"
TABLES = (
    "CREATE TABLE migrations (number INTEGER PRIMARY KEY, ran_at TEXT NOT NULL)",
    f"CREATE TABLE users ({COMMON}, name TEXT, email TEXT)",
    f"CREATE TABLE environments ({COMMON}, name TEXT, branch TEXT, key TEXT)",
    f"CREATE TABLE agents ({COMMON}, environment_id INTEGER, session TEXT, provider TEXT, state TEXT, role TEXT)",
    f"CREATE TABLE settings ({COMMON}, environment_id INTEGER, key TEXT, value TEXT)",
    f"CREATE TABLE tasks ({COMMON}, environment_id INTEGER, title TEXT, brief TEXT, priority INTEGER, state TEXT, started_at TEXT, completed_at TEXT, outcome TEXT,"
    " block_reason TEXT)",
    f"CREATE TABLE task_logs ({COMMON}, task_id INTEGER, line TEXT)",
    f"CREATE TABLE links ({COMMON}, source TEXT, target TEXT, link_type TEXT)",
    f"CREATE TABLE plans ({COMMON}, environment_id INTEGER, title TEXT, brief TEXT, state TEXT, block_reason TEXT)",
    f"CREATE TABLE phases ({COMMON}, environment_id INTEGER, title TEXT, completion_rule TEXT, checkpoint INTEGER)",
    f"CREATE TABLE plan_reviews ({COMMON}, plan_id INTEGER, verdict TEXT)",
    f"CREATE TABLE messages ({COMMON}, environment_id INTEGER, author TEXT, session TEXT, text TEXT, reply_target INTEGER, read_at TEXT, data TEXT)",
    f"CREATE TABLE memories ({COMMON}, environment_id INTEGER, text TEXT, weight INTEGER, keywords TEXT, removed_at TEXT, expires_at TEXT, expiry_row TEXT)",
    f"CREATE TABLE phone_codes ({COMMON}, code TEXT)",
    f"CREATE TABLE old_reports ({COMMON}, body TEXT)",
    f"CREATE TABLE questions ({COMMON}, environment_id INTEGER, text TEXT, options TEXT, answer TEXT, recommended TEXT)",
    f"CREATE TABLE shares ({COMMON}, environment_id INTEGER, token TEXT, expires_at TEXT, approved INTEGER, password TEXT, comments INTEGER, views INTEGER, stopped_at TEXT)",
    f"CREATE TABLE phones ({COMMON}, environment_id INTEGER, name TEXT, key TEXT, expires_at TEXT, last_visited_at TEXT, ended_at TEXT, subscription TEXT, pushed TEXT,"
    " subscription_failed_at TEXT)",
    f"CREATE TABLE sent_agents ({COMMON}, environment_id INTEGER, name TEXT, brief TEXT, provider TEXT, model TEXT, session TEXT, helper_type TEXT, state TEXT)",
    f"CREATE TABLE worker_todos ({COMMON}, environment_id INTEGER, position INTEGER, text TEXT, complete INTEGER)",
    f"CREATE TABLE proofs ({COMMON}, environment_id INTEGER, point INTEGER, text TEXT, state TEXT, shortfall TEXT)",
    f"CREATE TABLE subagents ({COMMON}, environment_id INTEGER, dispatch TEXT, brief TEXT, agent_type TEXT, model TEXT, session TEXT, state TEXT, name TEXT)",
    f"CREATE TABLE sequences ({COMMON}, title TEXT, steps TEXT, end_condition TEXT, locked INTEGER, triggers TEXT)",
    f"CREATE TABLE dumps ({COMMON}, environment_id INTEGER, title TEXT, brief TEXT, files TEXT, parts TEXT, items TEXT, log TEXT, question TEXT, answers TEXT, options TEXT, choice TEXT, claimed TEXT, declined TEXT, summary_text TEXT, summary TEXT, outcome TEXT, queued_at REAL, completed_at REAL, stopped INTEGER, dismissed INTEGER, removed_at REAL, removed_refs TEXT)",
    f"CREATE TABLE templates ({COMMON}, title TEXT, targets TEXT, purpose TEXT, brief TEXT, parts TEXT, commands TEXT)",
    f"CREATE TABLE docs ({COMMON}, environment_id INTEGER, title TEXT, body TEXT, abstract TEXT, settled_reason TEXT, unfinished INTEGER)",
    f"CREATE TABLE doc_revisions ({COMMON}, number INTEGER, title TEXT, abstract TEXT, body TEXT, change TEXT, closes_at REAL, environment_id INTEGER)",
    f"CREATE TABLE reports ({COMMON}, environment_id INTEGER, title TEXT, body TEXT, abstract TEXT, report_type TEXT, items TEXT, start_at TEXT, end_at TEXT, read_at TEXT,"
    " settled_reason TEXT, unfinished INTEGER)",
    f"CREATE TABLE rules ({COMMON}, text TEXT, reason TEXT, keywords TEXT, presence INTEGER, trigger TEXT, condition TEXT, is_single_use INTEGER)",
    f"CREATE TABLE reminders ({COMMON}, environment_id INTEGER, text TEXT, keywords TEXT, presence INTEGER, due_at TEXT, trigger TEXT, condition TEXT,"
    " is_single_use INTEGER)",
    f"CREATE TABLE edits ({COMMON}, environment_id INTEGER, session TEXT, path TEXT, edit_type TEXT, added INTEGER, removed INTEGER, first_line INTEGER, last_line INTEGER, rows TEXT, command TEXT, tool_use INTEGER, time REAL, old_text TEXT, new_text TEXT)",
    f"CREATE TABLE command_outputs ({COMMON}, environment_id INTEGER, chain TEXT, command TEXT, session TEXT, folder TEXT, moved INTEGER, ended INTEGER, status INTEGER, is_announced INTEGER, wait INTEGER, is_watched INTEGER, watch_reader TEXT, is_interrupted INTEGER, watch_title TEXT, is_read INTEGER, summary TEXT, ran_in TEXT, is_quiet_named INTEGER, is_total_asked INTEGER, is_complete_reported INTEGER, invalid_reason TEXT, reader_revision REAL)",
    f"CREATE TABLE reactions ({COMMON}, environment_id INTEGER, emoji TEXT, author TEXT)",
    f"CREATE TABLE dashboard_rows ({COMMON}, plugin TEXT, key TEXT, label TEXT, badge TEXT, tone TEXT, note TEXT, section TEXT)",
    f"CREATE TABLE notices ({COMMON}, environment_id INTEGER, title TEXT, link TEXT, label TEXT, tone TEXT, closed_at TEXT)",
    f"CREATE TABLE aliases ({COMMON}, name TEXT, line TEXT, reader TEXT, description TEXT, variables TEXT, plugin TEXT, background INTEGER, worker_access INTEGER)",
    f"CREATE TABLE suggestions ({COMMON}, key TEXT, title TEXT, answer TEXT)",
    f"CREATE TABLE plugins ({COMMON}, name TEXT, source TEXT, commit_sha TEXT, linked INTEGER, enabled INTEGER, manifest TEXT, settings TEXT, hashes TEXT,"
    " last_fault TEXT, failed_at TEXT, fault_streak INTEGER, waiting TEXT, release TEXT, is_user_disabled INTEGER, wait_target TEXT, last_fault_at TEXT)",
    f"CREATE TABLE scheduled_jobs ({COMMON}, environment_id INTEGER, session TEXT, job_id TEXT, cron TEXT, prompt TEXT, recurring INTEGER, ended INTEGER)",
    f"CREATE TABLE timings ({COMMON}, method TEXT, route TEXT, ms INTEGER, time REAL, loads TEXT)",
    f"CREATE TABLE statistics ({COMMON}, key TEXT, value INTEGER)",
    f"CREATE TABLE reader_reports ({COMMON}, environment_id INTEGER, reader TEXT, output INTEGER, command TEXT, session TEXT, findings TEXT, fixes TEXT, read_at TEXT, dismissal TEXT, is_refuted INTEGER, verdict TEXT, judged_at TEXT)",
    f"CREATE TABLE triggers ({COMMON}, action TEXT, text TEXT, phrases TEXT, is_scheduled INTEGER, next_at TEXT, interval_minutes INTEGER, cron_line TEXT, end_at TEXT,"
    " fire_limit INTEGER, fired_count INTEGER)",
    f"CREATE TABLE checks ({COMMON}, title TEXT, command TEXT, interval INTEGER, last_passed INTEGER, last_output TEXT, last_run_at TEXT, brief TEXT, last_duration REAL,"
    " last_report TEXT, progress TEXT, last_fault TEXT, wait_target INTEGER, is_retired INTEGER, failure_reported_at REAL, last_stopped INTEGER)",
    f"CREATE TABLE reader_suggestions ({COMMON}, part TEXT, suggested_at REAL)",
    f"CREATE TABLE collections ({COMMON})",
    f"CREATE TABLE entries ({COMMON})",
    f"CREATE TABLE journal_versions ({COMMON})",
    f"CREATE TABLE library_items ({COMMON})",
    f"CREATE TABLE mcp_servers ({COMMON}, name TEXT, title TEXT, transport TEXT, command TEXT, args TEXT, url TEXT, key_var TEXT, auth TEXT, state TEXT, last_error TEXT)",
    f"CREATE TABLE migrated_rows ({COMMON})",
    f"CREATE TABLE release_messages ({COMMON})",
    f"CREATE TABLE secrets ({COMMON}, title TEXT, brief TEXT, secret_type TEXT, fields TEXT, filled TEXT, programs TEXT, proposed TEXT, helpers INTEGER, url TEXT,"
    " auto_login INTEGER, questioned_at TEXT, used_at TEXT, session_at TEXT, session_expires TEXT, login_started_at TEXT, deleted_at TEXT)",
    f"CREATE TABLE state_transitions ({COMMON})",
    f"CREATE TABLE test_turns ({COMMON})",
    f"CREATE TABLE version3_migrations ({COMMON})",
)
STAMP = "2026-09-01T10:00:00+00:00"
USER = "user:1"
JANUARY_2026, JANUARY_2036 = "2026-01-01T00:00:00+00:00", "2036-01-01T00:00:00+00:00"
SHARE_TOKEN = "648b92de-9235-4709-a2f3-33d968a3a4bf"
SECRET_COLUMNS = "(title, brief, secret_type, fields, filled, programs, proposed, helpers, url, deleted_at, created_at, creator)"
GITHUB_FIELDS = '[{"name": "key", "hidden": true, "variable": "GITHUB_KEY"}]'
AWS_FIELDS = ('[{"name": "username", "hidden": false, "variable": "AWS_CONSOLE_USERNAME"},'
              ' {"name": "password", "hidden": true, "variable": "AWS_CONSOLE_PASSWORD"}]')
SERVER_COLUMNS = "(name, title, transport, command, args, url, key_var, auth, state, last_error, created_at, creator)"
PROJECT_ID = "5c1d0e9a7b2f4e3d8a6b1c0d9e8f7a6b"
GITHUB_VALUE = "ghv4-value-0a1b2c3d"
SERVER_KEY = "ghp_v4key_9z8y7x6w"
ROWS = (
    ("users", "(name, email, created_at)", ("Ada", "ada@example.org", STAMP)),
    ("environments", "(name, branch, key, created_at, creator)", ("main", "development", "key-main", STAMP, "system:")),
    ("environments", "(name, branch, key, created_at, creator)", ("side", "development", "key-side", STAMP, "system:")),
    ("agents", "(environment_id, session, provider, state, role, created_at, creator)", (1, "s-1", "claude", "idle", "main", STAMP, "system:")),
    ("agents", "(environment_id, session, provider, state, role, created_at, creator)", (1, "s-2", "claude", "idle", "ghost-role", STAMP, "system:")),
    ("agents", "(environment_id, session, provider, state, created_at, creator)", (1, "s-early", "claude", "ended", STAMP, "system:")),
    ("agents", "(environment_id, session, provider, state, role, created_at, creator)", (1, "s-gone:sub-1", "codex", "ended", "subagent", STAMP, "system:")),
    ("settings", "(environment_id, key, value, created_at, creator)", (None, "memories.keyword-limit", "4", STAMP, USER)),
    ("settings", "(environment_id, key, value, created_at, creator)", (None, "no.such.key", "1", STAMP, USER)),
    ("tasks", "(environment_id, title, brief, priority, state, created_at, creator)", (1, "Fix the cart", "the total is wrong", 100, "open", STAMP, USER)),
    ("tasks", "(environment_id, title, brief, priority, state, created_at, creator)", (1, "Ship the cart", "", 150, "started", STAMP, "agent:s-1")),
    ("tasks", "(environment_id, title, brief, priority, state, block_reason, created_at, creator)", (1, "Wait for the price list", "", 100, "paused", "the list is late", STAMP, USER)),
    ("tasks", "(environment_id, title, brief, priority, state, created_at, creator)", (1, "A task in a lost state", "", 100, "limbo", STAMP, USER)),
    ("tasks", "(environment_id, title, brief, priority, state, created_at, creator)", (1, "Ship the till", "", 100, "started", STAMP, USER)),
    ("task_logs", "(task_id, line, created_at, creator)", (1, "the totals are worked out", STAMP, "agent:s-1")),
    ("reactions", "(id, environment_id, emoji, author, created_at, creator)", (1, 1, "👍", "user", "2026-10-01T10:00:00+00:00", "person:Ada")),
    ("links", "(source, target, link_type, created_at, creator)", ("reactions:1", "messages:2", "reacts", "2026-10-01T10:00:00+00:00", "person:Ada")),
    ("links", "(source, target, link_type, created_at, creator)", ("tasks:2", "tasks:1", "depends", STAMP, USER)),
    ("links", "(source, target, link_type, created_at, creator)", ("tasks:1", "tasks:2", "depends", STAMP, USER)),
    ("links", "(source, target, link_type, created_at, creator)", ("agents:1", "tasks:2", "holds", STAMP, USER)),
    ("plans", "(environment_id, title, brief, state, created_at, creator)", (1, "Checkout", "", "approved", STAMP, USER)),
    ("plans", "(environment_id, title, brief, state, created_at, creator)", (1, "Payments", "", "paused", STAMP, USER)),
    ("plans", "(environment_id, title, brief, state, created_at, creator)", (1, "Cart rework", "", "reviewing", STAMP, USER)),
    ("phases", "(environment_id, title, completion_rule, checkpoint, created_at, creator)", (1, "Fix the total", "the total is right", 0, STAMP, USER)),
    ("links", "(source, target, link_type, created_at, creator)", ("phases:1", "plans:3", "phase_of", STAMP, USER)),
    ("phases", "(environment_id, title, completion_rule, checkpoint, created_at, creator)", (1, "Ship it", "it is live", 1, STAMP, USER)),
    ("links", "(source, target, link_type, created_at, creator)", ("phases:2", "plans:3", "phase_of", STAMP, USER)),
    ("links", "(source, target, link_type, created_at, creator)", ("tasks:1", "phases:1", "in_phase", STAMP, USER)),
    ("links", "(source, target, link_type, created_at, creator)", ("tasks:3", "phases:1", "in_phase", STAMP, USER)),
    ("links", "(source, target, link_type, created_at, creator)", ("tasks:2", "phases:1", "in_phase", STAMP, USER)),
    ("links", "(source, target, link_type, created_at, creator)", ("tasks:2", "phases:2", "in_phase", STAMP, USER)),
    ("plan_reviews", "(plan_id, verdict, created_at)", (3, "approved", STAMP)),
    ("plan_reviews", "(plan_id, verdict, created_at)", (3, "changes", STAMP)),
    ("messages", "(environment_id, author, text, created_at, creator)", (1, "user", "Ship the cart today", STAMP, USER)),
    ("messages", "(environment_id, author, session, text, reply_target, created_at, creator)", (1, "agent", "s-1", "Shipping it", 1, STAMP, "agent:s-1")),
    ("messages", "(environment_id, author, text, data, created_at, creator)", (1, "system", "Task 1 started", '{"kind": "task_card"}', STAMP, "system:")),
    ("messages", "(environment_id, author, text, data, created_at, creator)", (1, "system", "A report", '{"kind": "report"}', STAMP, "system:")),
    ("messages", "(environment_id, author, text, created_at, creator)", (9, "user", "A message of a removed environment", STAMP, USER)),
    ("memories", "(environment_id, text, weight, keywords, created_at, creator)", (1, "Totals are in cents", 5, '["totals"]', STAMP, USER)),
    ("memories", "(environment_id, text, weight, keywords, expires_at, created_at, creator)", (1, "Use the old API until March", 5, "[]", JANUARY_2026, STAMP, USER)),
    ("memories", "(environment_id, text, weight, keywords, expires_at, created_at, creator)", (1, "Deploy at nine", 5, "[]", JANUARY_2036, STAMP, USER)),
    ("memories", "(environment_id, text, weight, keywords, removed_at, created_at, creator)", (1, "A removed fact", 5, "[]", STAMP, STAMP, USER)),
    ("memories", "(environment_id, text, weight, keywords, expiry_row, created_at, creator)", (1, "Remove this when the cart task is done", 0, '["cart", "task"]', "tasks:1", STAMP, USER)),
    ("memories", "(environment_id, text, weight, keywords, created_at, creator)", (1, "A long fact. " * 40, 5, "[]", STAMP, USER)),
    ("phone_codes", "(code, created_at)", ("123456", STAMP)),
    ("old_reports", "(body, created_at)", ("a report", STAMP)),
    ("questions", "(environment_id, text, options, answer, recommended, created_at, creator)", (1, "Which database?", '["Postgres", "SQLite"]', "SQLite", "SQLite", STAMP, "agent:s-1")),
    ("questions", "(environment_id, text, options, answer, recommended, created_at, creator)", (1, "Ship on Friday?", "[]", "", "", STAMP, "agent:s-1")),
    ("questions", "(environment_id, text, options, answer, recommended, created_at, creator)", (1, "Why? " * 120, "[]", "", "", STAMP, "agent:s-1")),
    ("questions", "(environment_id, text, options, answer, recommended, created_at, creator)", (1, "What did the early session ask?", "[]", "", "", STAMP, "agent:s-early")),
    ("questions", "(environment_id, text, options, answer, recommended, created_at, creator)", (1, "What did the session with no row ask?", "[]", "", "", STAMP, "agent:s-gone")),
    ("questions", "(environment_id, text, options, answer, recommended, created_at, creator)", (2, "What did the session ask later elsewhere?", "[]", "", "", JANUARY_2036, "agent:s-gone")),
    ("questions", "(environment_id, text, options, answer, recommended, created_at, creator)", (1, "Which colour did version 3 ask?", "[]", "", "", STAMP, "user:1")),
    ("shares", "(environment_id, token, expires_at, approved, comments, views, created_at, creator)", (1, SHARE_TOKEN, JANUARY_2036, 1, 0, 3, STAMP, USER)),
    ("links", "(source, target, link_type, created_at, creator)", ("shares:1", "plans:3", "shares", STAMP, USER)),
    ("shares", "(environment_id, token, expires_at, approved, comments, views, stopped_at, created_at, creator)", (1, "stopped-token", JANUARY_2036, 1, 0, 0, STAMP, STAMP, USER)),
    ("links", "(source, target, link_type, created_at, creator)", ("shares:2", "plans:1", "shares", STAMP, USER)),
    ("shares", "(environment_id, token, expires_at, approved, comments, views, created_at, creator)", (1, "expired-token", JANUARY_2026, 1, 0, 0, STAMP, USER)),
    ("links", "(source, target, link_type, created_at, creator)", ("shares:3", "plans:1", "shares", STAMP, USER)),
    ("phones", "(environment_id, name, key, expires_at, created_at, creator)", (1, "Ada's phone", "phone-key", JANUARY_2036, STAMP, USER)),
    ("sent_agents", "(environment_id, name, brief, provider, model, session, helper_type, state, created_at, creator)", (1, "Ada", "fix the cart", "claude", "sonnet", "s-3", "worker", "merged", STAMP, "agent:s-1")),
    ("worker_todos", "(environment_id, position, text, complete, created_at, creator)", (1, 1, "read the cart", 1, STAMP, "agent:s-3")),
    ("links", "(source, target, link_type, created_at, creator)", ("worker_todos:1", "tasks:1", "todo", STAMP, USER)),
    ("proofs", "(environment_id, point, text, state, created_at, creator)", (1, 1, "cart.py:12 and its test", "checked", STAMP, "agent:s-3")),
    ("links", "(source, target, link_type, created_at, creator)", ("proofs:1", "tasks:1", "proves", STAMP, USER)),
    ("subagents", "(environment_id, dispatch, brief, agent_type, model, session, state, name)", (1, "d-1", "read the cart", "Explore", "haiku", "s-1", "ended", "Darwin")),
    ("sequences", "(title, steps, locked, triggers, created_at, creator)", ("Release steps", '[{"title": "Run the suite", "instructions": "all of it"}, {"title": "Tag it", "instructions": ""}]', 0, "[]", STAMP, USER)),
    ("sequences", "(title, steps, locked, triggers, created_at, creator)", ("Broken trigger", '[{"title": "Run the suite", "instructions": ""}]', 0, '[{"trigger_type": "nonsense"}]', STAMP, USER)),
    ("sequences", "(title, steps, locked, triggers, created_at, creator)", ("Broken guard", '[{"title": "Run the suite", "instructions": "", "allowed_commands": ["("]}]', 0, "[]", STAMP, USER)),
    ("templates", "(title, targets, purpose, brief, parts, commands, created_at, creator)", ("Find what is missing", '["plan"]', "critique", "Read the plan against its goal", '["Gaps: what is left out"]', "[]", STAMP, USER)),
    ("docs", "(environment_id, title, body, abstract, settled_reason, created_at, creator)", (0, "Cart rules", "## Totals\nin cents, see task 1", "How the cart counts", "", STAMP, USER)),
    ("docs", "(environment_id, title, body, abstract, settled_reason, created_at, creator)", (1, "Old notes", None, "Notes from the start", "kept for reference", STAMP, USER)),
    ("doc_revisions", "(number, title, abstract, body, change, closes_at, environment_id, created_at, creator)", (1, "Cart rules", "How the cart counts", "## Totals\nin cents", "written", 1767225600.0, 0, STAMP, USER)),
    ("links", "(source, target, link_type, created_at, creator)", ("doc_revisions:1", "docs:1", "revision_of", STAMP, USER)),
    ("reports", "(environment_id, title, body, abstract, report_type, created_at, creator)", (1, "Cart review", "## Found\nnothing", "What the review found", "", STAMP, "agent:s-1")),
    ("links", "(source, target, link_type, created_at, creator)", ("reports:1", "tasks:1", "about", STAMP, USER)),
    ("links", "(source, target, link_type, created_at, creator)", ("docs:1", "tasks:1", "mentions", STAMP, USER)),
    ("links", "(source, target, link_type, created_at, creator)", ("messages:1", "docs:1", "comments_on", STAMP, USER)),
    ("links", "(source, target, link_type, created_at, creator)", ("reports:1", "tasks:77", "about", STAMP, USER)),
    ("rules", "(text, reason, keywords, trigger, condition, created_at, creator)", ("Always keep totals in cents", "rounding errors", '["totals"]', "", "{}", STAMP, USER)),
    ("rules", "(text, reason, keywords, trigger, condition, created_at, creator)", ("A long project rule. " * 25, "it is long", "[]", "", "{}", STAMP, USER)),
    ("reminders", "(environment_id, text, keywords, due_at, trigger, condition, created_at, creator)", (1, "Run the cart tests before a commit", '["commit"]', None, "", "{}", STAMP, USER)),
    ("reminders", "(environment_id, text, keywords, due_at, trigger, condition, created_at, creator)", (1, "A long reminder. " * 30, "[]", None, "", "{}", STAMP, USER)),
    ("command_outputs", "(environment_id, chain, command, session, folder, ran_in, moved, ended, status, is_interrupted, is_read, summary, created_at, updated_at, creator)",
     (1, "chain-1", "pytest tests", "s-1", "/gone/outputs/chain-1", "/work/cart", 0, 1, 0, 0, 1, "12 passed", STAMP, JANUARY_2026, "agent:s-1")),
    ("command_outputs", "(environment_id, chain, command, session, folder, ran_in, moved, ended, status, is_interrupted, is_read, created_at, creator)",
     (1, "chain-2", "make build", "s-1", "/gone/outputs/chain-2", "/work/cart", 1, 1, 2, 0, 0, STAMP, "agent:s-1")),
    ("command_outputs", "(environment_id, chain, command, session, folder, ran_in, moved, ended, status, is_interrupted, is_read, created_at, creator)",
     (1, "chain-3", "sleep 900", "s-1", "/gone/outputs/chain-3", "/work/cart", 1, 0, 0, 0, 0, STAMP, "agent:s-1")),
    ("command_outputs", "(environment_id, chain, command, session, folder, ran_in, moved, ended, status, is_interrupted, is_read, created_at, creator)",
     (1, "chain-4", "tail -f log", "s-1", "/gone/outputs/chain-4", "/work/cart", 1, 1, 143, 1, 0, STAMP, "agent:s-1")),
    ("command_outputs", "(environment_id, chain, command, session, folder, ran_in, moved, ended, status, created_at, creator)",
     (1, "chain-5", "ls", "unknown-session", "/gone/outputs/chain-5", "/work/cart", 0, 1, 0, STAMP, "agent:unknown-session")),
    ("reader_reports", "(environment_id, reader, output, created_at)", (1, "pytest", 1, STAMP)),
    ("reader_suggestions", "(part, created_at)", ("pytest", STAMP)),
    ("reactions", "(environment_id, emoji, author, created_at, creator)", (1, "+1", "user", STAMP, USER)),
    ("notices", "(environment_id, title, link, label, created_at, creator)", (1, "Build is red", "https://ci.example.org/build/7", "build", STAMP, USER)),
    ("notices", "(environment_id, title, link, label, closed_at, created_at, creator)", (1, "Old report", "docs:1", "Open", STAMP, STAMP, USER)),
    ("aliases", "(name, line, reader, description, variables, plugin, background, worker_access, created_at, creator)",
     ("tests", "sh scripts/run_tests.sh {args}", "ghost-reader", "the scoped tests", '{"LIMIT": "60"}', "", 1, 1, STAMP, USER)),
    ("aliases", "(name, line, reader, description, variables, plugin, background, worker_access, created_at, creator)",
     ("gone-plugin-line", "echo gone", "", "", "{}", "gone-plugin", 0, 0, STAMP, USER)),
    ("collections", "(created_at, creator)", (STAMP, USER)),
    ("suggestions", "(key, title, answer, created_at, creator)", ("commandments-plugin", "Run Code Commandments as a plugin", "declined", STAMP, USER)),
    ("plugins", "(name, source, release, linked, enabled, manifest, settings, is_user_disabled, created_at, creator)",
     ("code-commandments", "https://example.org/code-commandments", "v6.26.0", 0, 1, '{"name": "code-commandments", "title": "Code Commandments"}',
      '{"folders_judged": ["src"], "judge_parallel": 2}', 0, STAMP, USER)),
    ("scheduled_jobs", "(environment_id, session, job_id, cron, prompt, recurring, ended, created_at, creator)", (1, "s-1", "job-1", "0 9 * * *", "stand up", 1, 0, STAMP, "agent:s-1")),
    ("statistics", "(key, value, created_at)", ("starts", 3, STAMP)),
    ("settings", "(environment_id, key, value, created_at, creator)", (0, "workers.most_out", "3", STAMP, USER)),
    ("settings", "(environment_id, key, value, created_at, creator)", (0, "workers.builder_may_dispatch", "false", STAMP, USER)),
    ("settings", "(environment_id, key, value, created_at, creator)", (0, "workers.command_kinds", '"read, search, edit"', STAMP, USER)),
    ("settings", "(environment_id, key, value, created_at, creator)", (0, "features.aliases", "true", STAMP, USER)),
    ("edits", "(environment_id, session, path, edit_type, added, removed, created_at, creator)", (1, "s-1", "cart.py", "edit", 11, 2, STAMP, "agent:s-1")),
    ("edits", "(environment_id, session, path, edit_type, added, removed, created_at, creator)", (1, "s-1", "totals.py", "create", 30, 0, STAMP, "agent:s-1")),
    ("edits", "(environment_id, session, path, edit_type, added, removed, created_at, creator)", (1, "", "merged.py", "edit", 4, 1, STAMP, USER)),
    ("edits", "(environment_id, session, path, edit_type, added, removed, created_at, creator)", (1, "gone-session", "lost.py", "edit", 1, 1, STAMP, "agent:gone-session")),
    ("dumps", "(environment_id, title, brief, files, parts, items, completed_at, outcome, created_at, creator)",
     (1, "Call notes", "Notes from the call", '["cart.csv"]', '["The cart rounds twice", "Ship on Friday"]',
      '{"The cart rounds twice": {"insight": "a fault", "outcome": "made a task", "refs": ["tasks:1"], "added": ["tasks:1"]}, "Ship on Friday": {"failed": "no date given"}, "cart.csv": {"insight": "totals"}}',
      1792000000.0, "1 filed, 1 failed", STAMP, USER)),
    ("dumps", "(environment_id, title, brief, files, parts, items, question, created_at, creator)", (1, "", "Pasted text", "[]", "[]", "{}", '{"text": "Which date?"}', STAMP, USER)),
    ("dumps", "(environment_id, title, brief, created_at, creator)", (9, "Lost", "In a removed environment", STAMP, USER)),
    ("settings", "(environment_id, key, value, created_at, creator)", (None, "profiles.model.claude", '"haiku"', STAMP, USER)),
    ("settings", "(environment_id, key, value, created_at, creator)", (None, "voices.profile", '"coach"', STAMP, USER)),
    ("settings", "(environment_id, key, value, created_at, creator)", (None, "voices.avatar_shown", '"working"', STAMP, USER)),
    ("settings", "(environment_id, key, value, created_at, creator)", (None, "layout",'{"tree": "a", "panes": {"a": {"tabs": ["chat", "tasks", "weather"]}}}', STAMP, USER)),
    ("triggers", "(phrases, action, text, is_scheduled, created_at, creator)", ('["deploy", "release"]', "nudge", "Run the release sequence", 0, STAMP, USER)),
    ("triggers", "(phrases, action, text, is_scheduled, created_at, creator)", ('["rm -rf"]', "deny", "never remove folders", 0, STAMP, USER)),
    ("triggers", "(phrases, action, text, is_scheduled, next_at, interval_minutes, fire_limit, fired_count, created_at, creator)", ("[]", "nudge", "Check the build", 1, JANUARY_2036, 30, 0, 2, STAMP, USER)),
    ("triggers", "(phrases, action, text, is_scheduled, fire_limit, fired_count, created_at, updated_at, creator)", ("[]", "nudge", "Said once", 1, 1, 1, STAMP, STAMP, USER)),
    ("triggers", "(phrases, action, text, is_scheduled, created_at, creator)", ('["empty"]', "nudge", "", 0, STAMP, USER)),
    ("checks", "(title, brief, command, interval, last_passed, last_output, last_run_at, wait_target, is_retired, created_at, creator)", ("Suite", "all green", "true", 0, 1, "", STAMP, 0, 0, STAMP, USER)),
    ("checks", "(title, brief, command, interval, last_passed, last_output, last_run_at, wait_target, is_retired, failure_reported_at, created_at, creator)", ("Lint", "", "echo two problems; false", 15, 0, "two problems", STAMP, 1, 0, 1788000000.0, STAMP, USER)),
    ("checks", "(title, brief, command, interval, is_retired, created_at, creator)", ("Old check", "", "true", 0, 1, STAMP, USER)),
    ("checks", "(title, brief, command, interval, is_retired, created_at, creator)", ("", "", "true", 0, 0, STAMP, USER)),
    ("checks", "(title, brief, command, interval, is_retired, created_at, creator)", ("task 3 waits until this passes", "", "test -f price-list.csv", 60, 0, STAMP, USER)),
    ("checks", "(title, brief, command, interval, is_retired, created_at, creator)", ("Task 3 waits until this passes", "", "test -f old-list.csv", 60, 1, STAMP, USER)),
    ("checks", "(title, brief, command, interval, is_retired, created_at, creator)", ("task 1 waits until this passes", "", "true", 60, 0, STAMP, USER)),
    ("secrets", SECRET_COLUMNS, ("Github", "gh api user", "api key", GITHUB_FIELDS, '["key"]', '["head"]', '["curl"]', 1, "", None, STAMP, USER)),
    ("secrets", SECRET_COLUMNS, ("AWS console", "", "login", AWS_FIELDS, "[]", "[]", "[]", 0, "", None, STAMP, USER)),
    ("secrets", SECRET_COLUMNS, ("Old token", "", "custom", '[{"name": "token", "hidden": true, "variable": "OLD_TOKEN_TOKEN"}]', "[]", "[]", "[]", 0, "",
                                 JANUARY_2026, STAMP, USER)),
    ("secrets", SECRET_COLUMNS, ("Portal", "", "browser login", "[]", "[]", "[]", "[]", 0, "https://portal.example.org", None, STAMP, USER)),
    ("statistics", "(key, value, created_at, creator)", ("profiles.designer.uses", 18, STAMP, "system:")),
    ("statistics", "(key, value, created_at, creator)", ("profiles.designer.last_used", 1793381111, STAMP, "system:")),
    ("statistics", "(key, value, created_at, creator)", ("verification.merges.5", 14, STAMP, "system:")),
    ("mcp_servers", SERVER_COLUMNS, ("github", "GitHub", "stdio", "npx", '["-y", "@modelcontextprotocol/server-github"]', "", "GITHUB_PERSONAL_ACCESS_TOKEN", "key",
                                     "needs_key", "", STAMP, USER)),
    ("mcp_servers", SERVER_COLUMNS, ("linear", "Linear", "http", "", "[]", "https://mcp.linear.app/mcp", "", "oauth", "failed", "timed out", STAMP, USER)),
)


def version_four_fixture(path: Path, with_rows: bool = True) -> Path:
    connection = sqlite3.connect(path)
    for statement in TABLES:
        connection.execute(statement)
    connection.execute("INSERT INTO migrations VALUES (1, ?)", [STAMP])
    for table, columns, values in ROWS if with_rows else ():
        connection.execute(f"INSERT INTO {table} {columns} VALUES ({', '.join('?' for _ in values)})", values)
    connection.commit()
    connection.close()
    return path


def with_private_values(journal_folder: Path, secrets_folder: Path) -> None:
    """What version 4 kept outside the project: the project's id, its values file in the secrets folder and its MCP
    server keys under ~/.journal/keys, named by the project folder's path."""
    (journal_folder / "project-id").write_text(PROJECT_ID)
    secrets_folder.mkdir(parents=True, exist_ok=True)
    (secrets_folder / f"{PROJECT_ID}.env").write_text(f'# version 4 values\nGITHUB_KEY="{GITHUB_VALUE}"\n')
    keys = Path.home() / ".journal" / "keys"
    keys.mkdir(parents=True, exist_ok=True)
    (keys / f"{str(journal_folder.resolve().parent).strip('/').replace('/', '-')}.json").write_text(f'{{"GITHUB_PERSONAL_ACCESS_TOKEN": "{SERVER_KEY}"}}\n')


def strip_release_columns(path: Path) -> None:
    """The shape an older version 4 release made: tables without the columns later releases added."""
    connection = sqlite3.connect(path)
    for table, column in (("tasks", "block_reason"), ("memories", "expiry_row"), ("messages", "data")):
        connection.execute(f"ALTER TABLE {table} DROP COLUMN {column}")
    connection.commit()
    connection.close()


def with_unknown_table(path: Path) -> None:
    connection = sqlite3.connect(path)
    connection.execute("CREATE TABLE gadgets (id INTEGER PRIMARY KEY, name TEXT)")
    connection.execute("INSERT INTO gadgets (name) VALUES ('a')")
    connection.commit()
    connection.close()


def with_message_rows(path: Path, count: int) -> None:
    connection = sqlite3.connect(path)
    connection.executemany("INSERT INTO messages (environment_id, author, text, created_at, creator) VALUES (1, 'user', ?, ?, ?)",
                           [(f"message {index}", STAMP, USER) for index in range(count)])
    connection.commit()
    connection.close()


def table_names(path: Path) -> list[str]:
    connection = sqlite3.connect(path)
    try:
        return [row[0] for row in connection.execute("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name")]
    finally:
        connection.close()
