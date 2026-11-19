from pathlib import Path

from journal.features.skills.support.skill_files import ready_folder


def test_a_link_to_itself_in_a_skill_folders_place_is_replaced_by_the_folder(tmp_path: Path):
    skills = tmp_path / "skills"
    skills.mkdir()
    (tmp_path / ".claude").mkdir()
    (tmp_path / ".claude" / "skills").symlink_to("../skills")
    looped = skills / "commandments"
    looped.symlink_to(tmp_path / ".claude" / "skills" / "commandments")
    ready_folder(tmp_path / ".claude" / "skills" / "commandments")
    assert looped.is_dir() and not looped.is_symlink(), "the self-pointing link is gone and a real folder stands in its place"


def test_a_dead_link_is_replaced_and_a_working_link_or_folder_is_kept(tmp_path: Path):
    dead = tmp_path / "dead"
    dead.symlink_to(tmp_path / "nowhere")
    ready_folder(dead)
    assert dead.is_dir() and not dead.is_symlink()
    target = tmp_path / "target"
    target.mkdir()
    (target / "kept").write_text("x")
    working = tmp_path / "working"
    working.symlink_to(target)
    ready_folder(working)
    assert working.is_symlink() and (working / "kept").read_text() == "x", "a link to a real folder is written through, not replaced"
    ready_folder(target)
    assert (target / "kept").exists()
