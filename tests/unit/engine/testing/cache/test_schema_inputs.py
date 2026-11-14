from engine.module.source_hash import SourceHash
from engine.testing.cache.schema_inputs import SchemaInputs


def sample_source(tmp_path):
    root = tmp_path / "core"
    files = {name: root / name for name in ("modules/tasks/migrations/m001.py", "modules/tasks/models/task.py", "modules/tasks/tasks_module.py", "modules/tasks/commands/task_make.py")}
    for file in files.values():
        file.parent.mkdir(parents=True, exist_ok=True)
        file.write_text("VALUE = 1\n")
    return root, files


def changed_hash(root, file):
    before = SchemaInputs.hash((root,))
    file.write_text("VALUE = 2\n")
    SourceHash.file_hash.cache_clear()
    return before != SchemaInputs.hash((root,))


def test_a_change_to_command_code_leaves_the_schema_hash_as_it_was(tmp_path):
    root, files = sample_source(tmp_path)
    assert not changed_hash(root, files["modules/tasks/commands/task_make.py"])


def test_a_change_to_a_migration_a_model_or_a_module_manifest_changes_the_schema_hash(tmp_path):
    root, files = sample_source(tmp_path)
    for name in ("modules/tasks/migrations/m001.py", "modules/tasks/models/task.py", "modules/tasks/tasks_module.py"):
        assert changed_hash(root, files[name])
