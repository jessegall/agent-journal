import pickle
import sqlite3
from dataclasses import dataclass

from engine.testing.templates.template_adaptation import TemplateAdaptation


def built_template(tmp_path, builder):
    template = tmp_path / "template"
    template.mkdir()
    connection = sqlite3.connect(template / "version-5.db", autocommit=True)
    connection.execute("CREATE TABLE skills (id INTEGER PRIMARY KEY, path TEXT, count INTEGER)")
    connection.execute("INSERT INTO skills (path, count) VALUES (?, 3)", tuple([f"{builder}/src/core/skills/one/SKILL.md"]))
    connection.execute("INSERT INTO skills (path, count) VALUES ('elsewhere/SKILL.md', 4)")
    connection.close()
    (template / "module_list").write_text(f'["{builder}/modules"]')
    TemplateAdaptation(builder).mark(template)
    return template


def test_a_template_built_in_another_checkout_gets_this_checkouts_paths(tmp_path):
    template = built_template(tmp_path, tmp_path / "project")
    adapted = tmp_path / "adapted"
    TemplateAdaptation(tmp_path / "worktree").adapted(template, adapted)
    rows = sqlite3.connect(adapted / "version-5.db").execute("SELECT path, count FROM skills ORDER BY id").fetchall()
    assert rows == [(f"{tmp_path / 'worktree'}/src/core/skills/one/SKILL.md", 3), ("elsewhere/SKILL.md", 4)]
    assert (adapted / "module_list").read_text() == f'["{tmp_path / "worktree"}/modules"]'
    assert TemplateAdaptation(tmp_path / "worktree").builder_name(adapted) == str(tmp_path / "worktree")


def test_the_builders_own_template_is_left_as_it_is(tmp_path):
    template = built_template(tmp_path, tmp_path / "project")
    assert TemplateAdaptation(tmp_path / "project").builder_name(template) == str(tmp_path / "project")
    rows = sqlite3.connect(template / "version-5.db").execute("SELECT path FROM skills WHERE id = 1").fetchall()
    assert rows == [tuple([f"{tmp_path / 'project'}/src/core/skills/one/SKILL.md"])]


def test_a_path_inside_the_pickled_story_state_is_replaced_too(tmp_path):
    template = built_template(tmp_path, tmp_path / "project")
    (template / "story-state.pickle").write_bytes(pickle.dumps(PathState(str(tmp_path / "project" / "bin"), ("keep", str(tmp_path / "project")))))
    adapted = tmp_path / "adapted"
    TemplateAdaptation(tmp_path / "worktree").adapted(template, adapted)
    state = pickle.loads((adapted / "story-state.pickle").read_bytes())
    assert state == PathState(str(tmp_path / "worktree" / "bin"), ("keep", str(tmp_path / "worktree")))



@dataclass(frozen=True)
class PathState:
    folder: str
    extra: tuple[str, ...]
