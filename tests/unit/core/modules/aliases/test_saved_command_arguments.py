from core.modules.aliases.support.saved_command_arguments import SavedCommandArguments


def test_the_journals_own_flags_before_the_bare_dashes_never_reach_the_command():
    arguments = ["--tail", "25", "--", "journal_hooks_test_wt_w217", "-w", "/app", "--tail", "9"]
    assert SavedCommandArguments.command_arguments(arguments) == ["journal_hooks_test_wt_w217", "-w", "/app", "--tail", "9"]


def test_a_cut_a_timeout_and_a_large_read_are_taken_out_and_other_arguments_stay():
    arguments = ["--cut", "10-20", "--timeout=5m", "--allow-large-read", "tests/cart.py"]
    assert SavedCommandArguments.command_arguments(arguments) == ["tests/cart.py"]


def test_arguments_with_none_of_the_journals_flags_pass_as_they_are():
    assert SavedCommandArguments.command_arguments(["-k", "cart", "--", "x"]) == ["-k", "cart", "--", "x"]
