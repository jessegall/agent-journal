import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
from features.statusline.group import grouped, ran  # noqa: E402
from tests.kit import check, done  # noqa: E402

NOW = 1_000_000.0


def cmd(what, at, **more):
    return {"what": what, "tool": "Bash", "at": at, **more}


def edit(at):
    return cmd("editing", at, effect="writes", files=["a.py"])


def kinds(commands):
    return [[one["kind"] for one in group] for group in grouped(ran(commands))]


# ONLY WHAT RAN, and only once
check("a command with nothing to say never reaches the pipeline", ran([cmd("", NOW), cmd("   ", NOW)]), [])
check("every command that ran is taken apart, in the order it ran",
      [one["at"] for one in ran([cmd("ls", NOW), cmd("pwd", NOW + 1)])], [NOW, NOW + 1])

# A RUN OF THE SAME KIND is one group
check("consecutive commands of one kind make one group", kinds([edit(NOW), edit(NOW + 1), edit(NOW + 2)]), [["writes"] * 3])
check("a command of another kind closes the group and opens the next",
      kinds([edit(NOW), cmd("git commit -m x", NOW + 1), edit(NOW + 2)]), [["writes"], [""], ["writes"]])
check("the same kind returning later is a group of its own, not the earlier one",
      len(kinds([cmd("cat x", NOW, effect="reads"), edit(NOW + 1), cmd("cat y", NOW + 2, effect="reads")])), 3)
check("journal commands group with each other and a shell command is not one of them",
      kinds([cmd("journal message unread", NOW), cmd("journal todo add 1", NOW + 1), cmd("curl http://x", NOW + 2)]),
      [["journal", "journal"], [""]])
check("nothing that ran is no group", grouped(ran([])), [])

done()
