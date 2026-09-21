from features.statusline.group import grouped, ran

NOW = 1_000_000.0


def cmd(what, at, **more):
    return {"what": what, "tool": "Bash", "at": at, **more}


def edit(at):
    return cmd("editing", at, effect="writes", files=["a.py"])


def kinds(commands):
    return [[one["kind"] for one in group] for group in grouped(ran(commands))]


def test_only_what_ran_and_only_once():
    assert ran([cmd("", NOW), cmd("   ", NOW)]) == [], "a command with nothing to say never reaches the pipeline"
    assert [one["at"] for one in ran([cmd("ls", NOW), cmd("pwd", NOW + 1)])] == [NOW, NOW + 1], \
        "every command that ran is taken apart, in the order it ran"


def test_a_run_of_the_same_kind_is_one_group():
    assert kinds([edit(NOW), edit(NOW + 1), edit(NOW + 2)]) == [["writes"] * 3], "consecutive commands of one kind make one group"
    assert kinds([edit(NOW), cmd("git commit -m x", NOW + 1), edit(NOW + 2)]) == [["writes"], [""], ["writes"]], \
        "a command of another kind closes the group and opens the next"
    assert len(kinds([cmd("cat x", NOW, effect="reads"), edit(NOW + 1), cmd("cat y", NOW + 2, effect="reads")])) == 3, \
        "the same kind returning later is a group of its own, not the earlier one"
    assert kinds([cmd("journal message unread", NOW), cmd("journal todo add 1", NOW + 1), cmd("curl http://x", NOW + 2)]) == \
        [["journal", "journal"], [""]], "journal commands group with each other and a shell command is not one of them"
    assert grouped(ran([])) == [], "nothing that ran is no group"
