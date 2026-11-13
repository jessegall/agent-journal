import json
import re
from pathlib import Path
import shutil
import subprocess

import pytest


"""Book 6 of doc 1255, stories 41 to 50 and 59: the detectors refuse SQL written by hand outside the builder's own
engine, and let prose, the engine, migrations and the listed views pass."""

ROOT = Path(__file__).resolve().parents[2]
CUSTOM = ROOT / ".commandments" / "custom"
TEXT_RULE = "architecture_queries_sql_text_in_a_builder"
CALL_RULE = "architecture_queries_statement_outside_the_builder"
OLD_RULES = ("architecture_core_sql_outside_database_layer", "architecture_queries_sql_condition_outside_conditions")
SKILL = "sql-in-the-database-layer"
QUERY_FILE = "src/core/modules/aliases/queries/alias_query.py"
KINDS = ["name = ?", "closed_at IS NULL", "holder_id IS NOT NULL", "id IN (1, 2)", "title LIKE ?", "id ORDER BY priority", "state GROUP BY state",
         "id LIMIT 5", "tasks JOIN agents ON agents.id = tasks.holder_id", "EXISTS(SELECT 1 FROM task_waits)", "SELECT id FROM tasks"]
DOCSTRING = "Selects the task to start and joins it to its plan, in order by priority, where it is in the plan."
METHODS = ("where", "where_in", "where_exists", "join", "group_by", "order_by", "limit")


def rule(name: str) -> dict:
    return json.loads((CUSTOM / f"{name}.json").read_text())


def proved(tmp_path: Path, rule_name: str, samples: dict[str, str]) -> str:
    """Runs the detector on the samples, each written at its path, and returns what the prover printed; the
    prover fails when a '@sin' line is not flagged or a '@righteous' line is."""
    custom = tmp_path / ".commandments" / "custom"
    (custom / "samples").mkdir(parents=True)
    (custom.parent / "config.json").write_text(json.dumps({"detectors": [rule_name]}))
    shutil.copyfile(CUSTOM / f"{rule_name}.json", custom / f"{rule_name}.json")
    shutil.copytree(CUSTOM / "skills" / SKILL, custom / "skills" / SKILL)
    for path, text in samples.items():
        sample = custom / "samples" / path
        sample.parent.mkdir(parents=True, exist_ok=True)
        sample.write_text(text)
    plugin = Path(".journal/plugins/code-commandments/bin/commandments-release")
    executable = next((str(folder / plugin) for folder in (ROOT, *ROOT.parents) if (folder / plugin).is_file()), None)
    if executable is None:
        pytest.skip("the code-commandments plugin is not installed")
    completed_process = subprocess.run([executable, "rule", "prove"], cwd=tmp_path, capture_output=True, text=True, timeout=30)
    assert completed_process.returncode == 0, completed_process.stdout + completed_process.stderr
    assert f"✓ {rule_name}" in completed_process.stdout, completed_process.stdout
    return completed_process.stdout


def flagged_text(text: str) -> str:
    return f'# @sin {TEXT_RULE}\nSQL = "{text}"\n# @righteous {TEXT_RULE}\nWORDS = "a task to start"\n'


def test_a_where_text_in_a_module_query_class_is_flagged(tmp_path):
    proved(tmp_path, TEXT_RULE, {QUERY_FILE: f'''class AliasQuery:
    def named(self, name):
        # @sin {TEXT_RULE}
        return self.kept.read("aliases", self.loader, "name = ?", [name])
'''})


@pytest.mark.parametrize("text", KINDS)
def test_each_kind_of_sql_text_is_flagged(tmp_path, text):
    proved(tmp_path, TEXT_RULE, {"src/core/modules/tasks/queries/task_reads.py": flagged_text(text)})


def test_a_statement_call_is_flagged(tmp_path):
    proved(tmp_path, CALL_RULE, {"src/core/modules/tasks/support/task_reads.py": f'''def read(database, Statement, sql):
    # @sin {CALL_RULE}
    return database.rows(Statement(sql))
'''})


def test_a_condition_class_that_writes_statement_text_is_flagged(tmp_path):
    proved(tmp_path, TEXT_RULE, {"src/core/modules/tasks/conditions/unheld_task.py": f'''class UnheldTask:
    def statement(self):
        # @sin {TEXT_RULE}
        return Statement("EXISTS(SELECT 1 FROM tasks WHERE holder_id IS NULL)")
'''})


def test_a_condition_that_composes_the_builder_passes(tmp_path):
    proved(tmp_path, CALL_RULE, {"src/core/modules/tasks/conditions/unheld_task.py": f'''class UnheldTask:
    def statement(self):
        # @righteous {CALL_RULE}
        return Exists(Select("tasks").matching(IsNull("holder_id"))).statement()

    def written(self):
        # @sin {CALL_RULE}
        return Statement("holder_id IS NULL")
'''})


def test_a_statement_wrapped_in_a_condition_method_is_flagged(tmp_path):
    """Story 58: wrapping SQL text in a condition class's statement() does not hide it."""
    proved(tmp_path, CALL_RULE, {"src/core/modules/tasks/conditions/stale_task.py": f'''class StaleTask:
    def statement(self):
        # @sin {CALL_RULE}
        return Statement("updated_at < datetime('now', '-7 days')")
'''})


def test_engine_query_and_database_files_are_exempt(tmp_path):
    sample = f'''def counted(table):
    # @righteous {TEXT_RULE}
    return Statement(f"SELECT count(*) FROM {{table}} WHERE id > ?", [0])
'''
    proved(tmp_path, TEXT_RULE, {"src/engine/query/sample_select.py": sample, "src/engine/database/sample_table.py": sample,
                                 "src/core/modules/tasks/queries/task_reads.py": flagged_text("id > ?")})


def test_migrations_are_exempt(tmp_path):
    proved(tmp_path, TEXT_RULE, {"src/core/modules/tasks/migrations/m099_sample.py": f'''class SampleMigration:
    # @righteous {TEXT_RULE}
    statements = ["UPDATE tasks SET priority = 'normal' WHERE priority IS NULL"]
''', "src/core/modules/tasks/queries/task_reads.py": flagged_text("priority IS NULL")})


def test_a_views_file_with_sql_text_is_flagged(tmp_path):
    proved(tmp_path, TEXT_RULE, {"src/core/modules/tasks/models/support/views.py": f'''# @sin {TEXT_RULE}
OPEN_SELECT = "SELECT id FROM tasks WHERE closed_at IS NULL"
'''})


def test_no_view_is_exempt():
    patterns = [step.get("fileMatches", "") for name in (TEXT_RULE, CALL_RULE) for step in rule(name)["find"]["reject"]]
    assert [pattern for pattern in patterns if "views" in pattern] == []


def test_prose_that_looks_like_sql_is_not_flagged(tmp_path):
    proved(tmp_path, TEXT_RULE, {"src/core/modules/tasks/support/task_texts.py": f'''# @righteous {TEXT_RULE}
PICK = "select a task"
# @righteous {TEXT_RULE}
SORT = "order by priority"
# @righteous {TEXT_RULE}
PLACED = "a task is in the plan"


def held(task):
    # @sin {TEXT_RULE}
    return "holder_id = ?"
'''})
    assert re.search(text_pattern(), DOCSTRING) is None


def text_pattern() -> str:
    return next(step["textMatches"] for step in rule(TEXT_RULE)["find"]["where"][0]["any"] if "textMatches" in step)


def test_the_sin_names_the_method_for_each_kind():
    text = rule(TEXT_RULE)["sin"]["rule"]
    assert [method for method in METHODS if not re.search(rf"\b{method}\b", text)] == []
    assert rule(TEXT_RULE)["sin"]["name"] == "sql-text-in-a-builder"


def test_the_two_old_sql_detectors_are_gone():
    assert [name for name in OLD_RULES if (CUSTOM / f"{name}.json").exists()] == []


def test_a_connection_execute_call_outside_the_database_layer_is_flagged(tmp_path):
    proved(tmp_path, CALL_RULE, {"src/core/modules/tasks/support/task_columns.py": f'''def columns(database):
    # @sin {CALL_RULE}
    return database.connection.execute("PRAGMA table_info(tasks)").fetchall()
''', "src/engine/database/sample_columns.py": f'''def columns(database):
    # @righteous {CALL_RULE}
    return database.connection.execute("PRAGMA table_info(tasks)").fetchall()
'''})
