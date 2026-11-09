import subprocess

import pytest


@pytest.mark.parametrize("command", [["claude", "-p", "hello"], ["/usr/local/bin/codex", "exec", "hello"], "claude -p hello"])
def test_a_story_without_the_flag_may_not_start_a_real_agent_program(command):
    with pytest.raises(RuntimeError, match="only with --real-program"):
        subprocess.Popen(command)


def test_a_story_without_the_flag_may_start_any_other_program():
    subprocess.Popen(["true"]).wait()


def test_a_story_without_the_flag_may_start_a_stand_in_of_that_name_in_its_temporary_folder(tmp_path):
    fake = tmp_path / "claude"
    fake.write_text("#!/bin/sh\n")
    fake.chmod(0o755)
    subprocess.Popen([str(fake)]).wait()
