from argparse import ArgumentParser

from core.base.cli.write_flags import WriteFlags


def test_the_reason_and_its_text_are_left_out_of_the_line_a_person_runs():
    assert WriteFlags.without_reason(["agent", "resume", "5", "--reason", "it is needed", "--environment", "main"]) == ("agent", "resume", "5", "--environment", "main")


def test_a_reason_written_with_an_equals_sign_is_left_out_too():
    assert WriteFlags.without_reason(["window", "allow", "a", "--reason=because"]) == ("window", "allow", "a")


def test_a_reason_after_a_double_dash_belongs_to_the_command_that_runs_and_stays():
    assert WriteFlags.without_reason(["secret", "run", "1", "--", "tool", "--reason", "x"]) == ("secret", "run", "1", "--", "tool", "--reason", "x")


def test_a_command_with_a_reason_of_its_own_keeps_it_and_is_not_marked_as_ours():
    own = ArgumentParser()
    own.add_argument("--reason")
    WriteFlags.add_reason(own)
    assert own.parse_args(["--reason", "x"]).reason == "x" and not hasattr(own.parse_args([]), "reason_is_ours")
    plain = ArgumentParser()
    WriteFlags.add_reason(plain)
    assert plain.parse_args([]).reason_is_ours is True
