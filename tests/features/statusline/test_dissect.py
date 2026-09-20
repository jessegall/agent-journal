import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
from features.statusline.dissect import NAME_CAP, dissect  # noqa: E402
from tests.kit import check, done  # noqa: E402

NOW = 1_000_000.0


def shell(what, **more):
    return dissect({"what": what, "tool": "Bash", "at": NOW, **more})


def tool(name, **more):
    return dissect({"what": "doing something", "tool": name, "at": NOW, **more})


def names(said):
    return [name["value"] for name in said["names"]]


# WHAT KIND A COMMAND IS, which is what decides its verb and its group
check("a command's kind is the effect the provider reported",
      [shell("x", effect=e, files=["a.py"])["kind"] for e in ("writes", "reads", "deletes", "tests", "installs", "builds")],
      ["writes", "reads", "deletes", "tests", "installs", "builds"])
check("a shell command with no effect is a plain run, and a journal command is its own kind",
      (shell("curl http://x")["kind"], shell("journal message read 7")["kind"]), ("", "journal"))
check("a shell command that finished and changed no file is not editing, whatever it looked like",
      (shell("touch a", effect="writes", done=NOW + 1)["kind"], shell("x", effect="writes", files=["a.py"])["kind"]), ("", "writes"))
check("while it is still running it is editing and does not know its files yet",
      (shell("git mv a b", effect="writes")["kind"], shell("git mv a b", effect="writes")["names"]), ("writes", []))
check("a tool that is not the shell is worked by hand, and never a journal command",
      (tool("Read", effect="reads")["hand"], tool("mcp__x__y")["kind"], shell("ls")["hand"]), (True, "", False))

# WHAT IT WORKED ON, taken from facts and never from the words of the command
check("a file tool names the file the provider reported", names(tool("Edit", effect="writes", files=["web/src/a.vue"])), ["a.vue"])
check("a file name stays whole, a spoken name does not",
      [name["whole"] for name in tool("Read", effect="reads", files=["a b c.png"])["names"] + tool("mcp__x__y", subject="x · y z")["names"]],
      [True, False])
check("a shell edit names the files the tree diff saw change, not the command",
      names(shell("python3 - <<'EOF'\nopen('x','w')\nEOF", effect="writes", files=["a.py", "b.py"])), ["a.py", "b.py"])
check("cat is always reading, wherever it stands in the line",
      [shell(c, effect="reads")["kind"] for c in ("cat a.py", "cd web && cat a.py", "for f in x; do cat $f; done")], ["reads"] * 3)
check("a glob or a grep is searching, not reading, and it names what it looked for",
      [(shell(c, effect="searches")["kind"], names(shell(c, effect="searches"))) for c in ("grep -rn def features", "cat *.md")],
      [("searches", ["def features"]), ("searches", ["*.md"])])
check("a read names a path and never a flag's value",
      (names(shell("sed -n 88,94p providers/base.py", effect="reads")), names(shell("ls", effect="reads"))), (["base.py"], []))
check("a test run names its subject, never its runner", names(shell("python3 tests/test_serve.py", effect="tests")), ["test_serve.py"])
check("a write is only editing when a file really changed",
      (shell("echo hi > out.txt", effect="writes", files=["out.txt"])["kind"], shell("echo hi > out.txt", effect="writes", done=NOW + 1)["kind"]),
      ("writes", ""))
check("a runner names the script it runs",
      [names(shell(c)) for c in ("python3 tests/features/statusline/samples.py", "node build.js", 'python3 -c "print(1)"')],
      [["python3 samples.py"], ["node build.js"], ["python3"]])
check("a plain shell command is named by its root and subcommand",
      (names(shell("npx prettier --write a.vue")), names(shell("cd web && npm run build"))), (["npx prettier"], ["npm run build"]))
check("a journal command is named in its own words", names(shell("journal message read 7")), ["reading message 7"])
check("a git command says what it does, not what it is called",
      [(shell(c)["kind"], names(shell(c))) for c in ("git add web/src/a.vue", "git push", "git checkout -b dev")],
      [("git", ["tracking web/src/a.vue"]), ("git", ["pushing changes"]), ("git", ["switching branch"])])
check("a git command that changed files is editing, and one that read them is reading",
      (shell("git mv a b", effect="writes", files=["b"])["kind"], shell("git log -3", effect="reads")["kind"]), ("writes", "reads"))
check("a command that did not edit anything never takes the name of a file it was blamed for",
      (names(shell("journal message read 7", files=["web/dist/assets/index.js"])), names(shell("ls", effect="reads", files=["a.js"]))),
      (["reading message 7"], []))
check("a name too long to show is cut", len(names(tool("Read", effect="reads", files=["a" * 80]))[0]), NAME_CAP)

# WHAT ELSE IT CARRIES, so a finished message keeps what it did
check("when it started, when it finished, what it changed and how it came out",
      {k: v for k, v in shell("pytest", done=NOW + 2, effect="tests", result={"failed": 3}, changed={"added": 4}).items()
       if k in ("at", "done", "result", "changed")},
      {"at": NOW, "done": NOW + 2, "result": {"failed": 3}, "changed": {"added": 4}})

done()
