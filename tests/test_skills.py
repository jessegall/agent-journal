from pathlib import Path

import features
from controllers.types import CONTROLLERS
import skills
from skills import reference, render, write


def test_skills_are_generated_from_features_subjects_and_the_core_reference(tmp_path):
    got = render()
    subjects = [path for path in (Path(__file__).resolve().parents[1] / "skills").glob("*.md") if path.name != "journal.md" and path.stem not in features.FEATURES]
    assert ("journal question ask" in render()["journal-questions/SKILL.md"], "questions" in [p.stem for p in subjects]) == (True, False), \
        "a subject a feature covers is written into that feature's skill, not beside it"
    assert (sorted(got)[:1], len(got)) == (["journal-agents/SKILL.md"], 1 + len(subjects) + len(features.FEATURES)), \
        "the core, subject skills and one per feature"
    core = got["journal/SKILL.md"]
    assert (core.startswith("---\nname: journal\n"), "## Reference: every noun and its words" in core) == (True, True), \
        "the core skill has its front matter and the reference"
    assert "Agents assign priority themselves when urgency, impact, dependencies or risk make a difference" in core, \
        "the core skill teaches autonomous to-do priority judgment"
    assert "File it immediately, before looking at files, investigating, implementing, or deferring it" in core, \
        "the core skill files different work before investigation"
    ref = reference()
    for type_, c in CONTROLLERS.items():
        assert all(f"journal {type_} {c.resource.names.get(m, m)}" in ref for m in ("create", "complete", "show")) is True, \
            f"{type_}: every word is in the reference under its noun"
    assert ("journal todo done <n>" in ref, "journal todo complete" in ref, "journal plan continue <n>" in ref) == (True, False, True), \
        "a type's own word, not the method's name"
    assert any(w in core for w in ("journal next", "MCP", " reference <n>", "kinds", "dispatcher", "verb")) is False, \
        "the old words never appear"
    auto = got["journal-auto/SKILL.md"]
    assert ("It listens to: agent.updated" in auto, "It speaks on idle" in auto, "Off by default" in auto) == (True, True, True), \
        "a feature's skill says what it listens to, when it speaks and its default"
    assert ("# Where a row came from" in got["journal-became/SKILL.md"], "cites nothing" in got["journal-became/SKILL.md"] or "was built on" in got["journal-became/SKILL.md"]) == (True, True), \
        "where a row came from names both the link it makes and the one it asks for"
    assert ("journal todo start" in got["journal-todos/SKILL.md"], "journal report create" in got["journal-reports/SKILL.md"]) == (True, True), \
        "subject skills use v2's singular noun and word commands"
    assert (
        "becomes `journal todo create` immediately" in got["journal-todos/SKILL.md"],
        "file the to-do immediately before investigating or implementing it" in got["journal-messages/SKILL.md"],
        "file it immediately before the reply or next implementation" in got["journal-deferral/SKILL.md"],
    ) == (True, True, True), "future work is filed before other work continues"
    folder = tmp_path / "written"
    written = write(folder)
    assert (len(written), (folder / "journal" / "SKILL.md").is_file(), (folder / "journal-work" / "SKILL.md").is_file()) == (len(got), True, True), \
        "written as SKILL.md files, one folder each"


def test_a_skill_whose_feature_is_gone_is_taken_away_everywhere_it_was_linked(tmp_path):
    project = tmp_path
    stale = project / skills.LIBRARY / "journal-gone"
    stale.mkdir(parents=True, exist_ok=True)
    (stale / "SKILL.md").write_text("a feature that no longer exists")
    skills.publish(project, ("claude",))
    assert (stale.exists(), (project / skills.LINKED["claude"] / "journal-gone").exists()) == (False, False), \
        "a skill whose feature is gone is pruned from the library and its links"
