from features.statusline.dissect import NAME_CAP, dissect

NOW = 1_000_000.0


def shell(what, **more):
    return dissect({"what": what, "tool": "Bash", "at": NOW, **more})


def tool(name, **more):
    return dissect({"what": "doing something", "tool": name, "at": NOW, **more})


def names(said):
    return [name["value"] for name in said["names"]]


def test_what_kind_a_command_is_decides_its_verb_and_group():
    assert [shell("x", effect=e, files=["a.py"])["kind"] for e in ("writes", "reads", "deletes", "tests", "installs", "builds")] == \
        ["writes", "reads", "deletes", "tests", "installs", "builds"], "a command's kind is the effect the provider reported"
    assert (shell("curl http://x")["kind"], shell("journal message read 7")["kind"]) == ("", "journal"), \
        "a shell command with no effect is a plain run, and a journal command is its own kind"
    assert (shell("touch a", effect="writes", done=NOW + 1)["kind"], shell("x", effect="writes", files=["a.py"])["kind"]) == ("", "writes"), \
        "a shell command that finished and changed no file is not editing, whatever it looked like"
    assert (shell("git mv a b", effect="writes")["kind"], shell("git mv a b", effect="writes")["names"]) == ("writes", []), \
        "while it is still running it is editing and does not know its files yet"
    assert (tool("Read", effect="reads")["hand"], tool("mcp__x__y")["kind"], shell("ls")["hand"]) == (True, "", False), \
        "a tool that is not the shell is worked by hand, and never a journal command"


def test_what_it_worked_on_is_taken_from_facts_never_from_the_words_of_the_command():
    assert [dissect({"what": f"reading {f}", "tool": "Read", "at": NOW, "effect": "reads", "files": [f]})["kind"]
            for f in ("shot.png", "clip.mp4", "notes.md")] == ["views", "watches", "reads"], \
        "a picture is viewed and a film is watched, not read"
    assert [dissect({"what": "x", "tool": "Bash", "at": NOW, "effect": "writes", "files": f, "made": m})["kind"]
            for f, m in ((["a.py"], ["a.py"]), (["a.py", "b.py"], ["a.py", "b.py"]), (["a.py", "b.py"], ["b.py"]), (["a.py"], []))] == \
        ["creates", "creates", "writes", "writes"], "a file made from nothing is creating, not editing"
    assert names(tool("Edit", effect="writes", files=["web/src/a.vue"])) == ["a.vue"], "a file tool names the file the provider reported"
    assert [name["whole"] for name in tool("Read", effect="reads", files=["a b c.png"])["names"] + tool("mcp__x__y", subject="x · y z")["names"]] == \
        [True, False], "a file name stays whole, a spoken name does not"
    assert names(shell("python3 - <<'EOF'\nopen('x','w')\nEOF", effect="writes", files=["a.py", "b.py"])) == ["a.py", "b.py"], \
        "a shell edit names the files the tree diff saw change, not the command"
    assert [shell(c, effect="reads")["kind"] for c in ("cat a.py", "cd web && cat a.py", "for f in x; do cat $f; done")] == ["reads"] * 3, \
        "cat is always reading, wherever it stands in the line"
    assert [(shell(c, effect="searches")["kind"], names(shell(c, effect="searches"))) for c in ("grep -rn def features", "cat *.md")] == \
        [("searches", ["def features"]), ("searches", ["*.md"])], "a glob or a grep is searching, not reading, and it names what it looked for"
    assert (names(shell("find . -name x.py", effect="searches")), names(shell("grep -rn def .", effect="searches"))) == \
        (["here x.py"], ["def here"]), "a bare dot is the folder it is standing in"
    assert names(shell("sed -n 160,175p web/src/layout/TopBar.vue; grep -rn z-index web/src | head -8", effect="searches")) == ["z-index web/src"], \
        "a search names what the searching command looked for, never the command beside it"
    assert names(shell("curl -s http://x/api/main/changes | head -c 300; ls -la .journal/runtime/changes.json", effect="reads")) == \
        ["changes.json"], "a read names the file the reading command read, not a URL beside it"
    assert (names(shell("sed -n 88,94p providers/base.py", effect="reads")), names(shell("ls", effect="reads"))) == (["base.py"], []), \
        "a read names a path and never a flag's value"
    assert names(shell("python3 tests/test_serve.py", effect="tests")) == ["test_serve.py"], "a test run names its subject, never its runner"
    assert (shell("echo hi > out.txt", effect="writes", files=["out.txt"])["kind"], shell("echo hi > out.txt", effect="writes", done=NOW + 1)["kind"]) == \
        ("writes", ""), "a write is only editing when a file really changed"
    assert [names(shell(c)) for c in ("python3 tests/features/statusline/samples.py", "node build.js", "python3 - <<'PY'\nx = 1\nPY")] == \
        [["python3 samples.py"], ["node build.js"], ["python3 script"]], \
        "a runner names the script it runs, and says script when the script is written inline"
    assert [names(shell(c)) for c in ("commandments judge ../agent-journal", "curl -s http://x", "mkdir -p a/b")] == \
        [["commandments judge"], ["curl"], ["mkdir"]], "a command with a subcommand names it, whatever the command is"
    assert (names(shell("npx prettier --write a.vue")), names(shell("cd web && npm run build"))) == (["npx prettier"], ["npm run build"]), \
        "a plain shell command is named by its root and subcommand"
    assert names(shell("journal message read 7")) == ["reading message 7"], "a journal command is named in its own words"
    assert [(shell(c)["kind"], names(shell(c))) for c in ("git add web/src/a.vue", "git push", "git checkout -b dev")] == \
        [("git", ["tracking a.vue"]), ("git", ["pushing changes"]), ("git", ["switching branch"])], \
        "a git command says what it does, not what it is called"
    assert (shell("git mv a b", effect="writes", files=["b"])["kind"], shell("git log -3", effect="reads")["kind"]) == ("writes", "reads"), \
        "a git command that changed files is editing, and one that read them is reading"
    assert (shell("for n in 1 2; do journal reaction read $n; done", effect="reads")["kind"],
            names(shell("for n in 1 2; do journal reaction read $n; done", effect="reads"))) == ("reads", []), \
        "a journal command's own words are only used under the journal's own verb"
    assert (names(shell("journal message read 7", files=["web/dist/assets/index.js"])), names(shell("ls", effect="reads", files=["a.js"]))) == \
        (["reading message 7"], []), "a command that did not edit anything never takes the name of a file it was blamed for"
    assert len(names(tool("Read", effect="reads", files=["a" * 80]))[0]) == NAME_CAP, "a name too long to show is cut"


def test_what_else_it_carries_so_a_finished_message_keeps_what_it_did():
    assert {k: v for k, v in shell("pytest", done=NOW + 2, effect="tests", result={"failed": 3}, changed={"added": 4}).items()
            if k in ("at", "done", "result", "changed")} == \
        {"at": NOW, "done": NOW + 2, "result": {"failed": 3}, "changed": {"added": 4}}, \
        "when it started, when it finished, what it changed and how it came out"
