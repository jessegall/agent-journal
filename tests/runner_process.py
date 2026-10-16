# Runs the runner script as a real process against a real server, so it is not in the default run: python3 -m pytest tests/runner_process.py
import json
import os
import subprocess
import time
from pathlib import Path
from urllib.request import Request, urlopen

from journal.app import App
from journal.config import Config
from journal.models.actor import Actor
from journal.models.setting import Setting
from journal.repositories.entries import Entries
from journal.repositories.scope import Scope
from journal.repositories.settings import Settings

SRC = Path(__file__).resolve().parent.parent / "src"


def wrapped(command: str, cwd_file: Path) -> str:
    """The line Claude Code hands the runner: its own set-up, the command in an eval, and a pwd into its file."""
    return f"setopt NO_EXTENDED_GLOB 2>/dev/null || true && eval '{command.replace(chr(39), chr(39) + chr(34) + chr(39) + chr(34) + chr(39))}' < /dev/null && pwd -P >| {cwd_file}"


def test_the_runner_runs_a_chain_part_by_part_and_moves_a_long_one_to_the_background(tmp_path: Path):
    subprocess.run(["git", "init", "-q"], cwd=tmp_path, check=True)
    (tmp_path / ".journal").mkdir()
    (tmp_path / ".journal" / "src").symlink_to(SRC)
    app = App(Config(tmp_path, port=0))
    settings = app.container.get(Settings)
    settings.save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.runtime().start()
    try:
        port = app.server().port
        (tmp_path / ".journal" / "port").write_text(str(port))
        urlopen(Request(f"http://127.0.0.1:{port}/hooks/claude", data=json.dumps({"hook_event_name": "SessionStart", "session_id": "s1"}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
        env = {**os.environ, "JOURNAL_ROOT": str(tmp_path), "JOURNAL_ENV": "main", "CLAUDECODE": "1", "SHELL": "/bin/zsh"}
        runner, cwd = str(tmp_path / ".journal" / "src" / "journal" / "hooks" / "run.sh"), tmp_path / "cwd"
        run = subprocess.run([runner, wrapped(f"cd {tmp_path} && echo one && false && echo three", cwd)], env=env, cwd=tmp_path, capture_output=True, text=True, timeout=20)
        assert run.stdout.strip() == "one" and run.returncode == 1 and not cwd.exists(), run.stderr
        run = subprocess.run([runner, wrapped("echo before; [ -f /nonexistent ] || exit 3; echo after", cwd)], env=env, cwd=tmp_path, capture_output=True, text=True, timeout=20)
        assert run.stdout.strip() == "before" and run.returncode == 3 and not cwd.exists(), run.stderr
        run = subprocess.run([runner, wrapped("false; echo still && false && echo skipped; echo last", cwd)], env=env, cwd=tmp_path, capture_output=True, text=True, timeout=20)
        assert run.stdout.split() == ["still", "last"] and run.returncode == 0 and cwd.exists(), run.stderr
        cwd.unlink()
        run = subprocess.run([runner, wrapped("echo first && exec echo replaced; echo never", cwd)], env=env, cwd=tmp_path, capture_output=True, text=True, timeout=20)
        assert run.stdout.split() == ["first", "replaced"] and run.returncode == 0 and "No such file" not in run.stderr, run.stderr
        settings.save(Setting(environment_id=0, key="shell.foreground", value=1), Actor.system())
        run = subprocess.run([runner, wrapped("seq 1 1000", cwd)], env=env, cwd=tmp_path, capture_output=True, text=True, timeout=60)
        shown = run.stdout.splitlines()
        assert shown[0] == "1" and shown[-1] == "1000" and len(shown) == 401 and "600 of 1000 lines cut from the middle" in shown[200], "a long output is cut to its first and last two hundred lines"
        run = subprocess.run([runner, wrapped("echo fast && sleep 3 && echo slow", cwd)], env=env, cwd=tmp_path, capture_output=True, text=True, timeout=20)
        assert "fast" in run.stdout and "moved to the background: sleep 3" in run.stdout and run.returncode == 0, run.stderr
        with app.container.get(Scope).of(1):
            entries = app.container.get(Entries)
            for _ in range(100):
                if entries.of_kind("ended", 5):
                    break
                time.sleep(0.1)
            ended = entries.of_kind("ended", 5)[0]
            assert ended.data["status"] == 0 and "slow" in ended.data["last"], ended.data
            assert [e.data["part"] for e in reversed(entries.of_kind("ran", 20))][-3:] == ["echo fast", "sleep 3", "echo slow"]
            run = subprocess.run([runner, wrapped("printf 'a\\nb\\n' > made.txt && echo untouched", cwd)], env=env, cwd=tmp_path, capture_output=True, text=True, timeout=20)
            changed = [e.data["changed"] for e in reversed(entries.of_kind("ran", 20))][-2:]
            assert changed == [[{"added": 2, "removed": 0, "path": "made.txt"}], []], changed
        assert cwd.read_text().strip() == str(tmp_path.resolve())
    finally:
        app.runtime().stop()


CORPUS = [
    "echo a; echo b",
    "false; echo still; false && echo no; echo yes",
    "true && echo one && false || echo two",
    "f() { echo f1; echo f2; }; f; f && f",
    "for i in 1 2; do echo $i; done; for j in a; do echo $j; done && echo end",
    "if true; then echo y; else echo n; fi; if false; then echo y; fi; echo after",
    "case x in x) echo matched;; *) echo no;; esac && echo c",
    "x=1; echo $x && x=2; echo $x",
    "cd /tmp && pwd; cd / && pwd",
    "echo \"a; b && c\" && echo 'd; e' && echo $'f;g'",
    "echo $(echo a; echo b) && echo `echo c; echo d`",
    "(echo sub; false) || echo recovered",
    "{ echo g1; echo g2; } && echo g3",
    "echo one # c1; c2 && c3\necho two",
    "cat <<EOF\nx; y && z\nEOF\necho after",
    "cat <<EOF && echo chained\nbody\nEOF",
    "[[ -n a && -n b ]] && echo db; (( 1 && 0 )) || echo arith",
    "x=; echo \"${x:-a;b}\"; echo ${x:-c}; x='a;b'; echo ${x//;/X}",
    "echo a | tr a b; printf '%s\\n' 'p;q' | wc -l",
    "set -o pipefail; false | true; echo $?",
    "false; echo $?; true; echo $?",
    "echo start; sleep 0.1 & wait; echo bg",
    "repeat 2 echo r; for i in 1 2; echo short$i",
    "echo 'it'\"'\"'s' && echo \"q\\\"q\"",
    "echo a; exit 3; echo b",
    "echo before; exec echo replaced; echo never",
    "true && { echo in; false; } || echo or",
    "while read -r l; do echo \"l=$l\"; done <<< $'1\\n2' && echo w",
    "echo a \\\n b; echo c",
    "echo a;echo b&&echo c",
    "cd /nonexistent 2>/dev/null || echo nocd; pwd",
    "printf 'x'; printf 'y\\n'",
    "echo \; && echo \\&\\&",
    "a=(1 2); echo ${a[2]}; echo ${#a}",
    "false || { echo h1; echo h2; }",
    "if [ 1 -eq 1 ] && [ 2 -eq 2 ]; then echo both; fi",
    "echo $((1 + 2)); echo $(( 3 && 4 ))",
    "until false; do echo once; break; done; echo u",
    "x=5; while [ $x -gt 3 ]; do x=$((x - 1)); done; echo $x",
    "for x in a b; echo $x && echo y; echo z",
    "repeat 2 echo r && echo s; echo t",
    "if true; echo short-if; echo after",
    "case a in a) echo one;& b) echo two;; esac; case b in a) echo no;| b) echo yes;; esac",
    "for i in 1; do echo done; done; echo fi; echo esac",
    "foreach x (p q)\necho $x\nend; echo after-foreach",
    "for ((i=0; i<2; i++)); do echo $i; done; echo c",
    "true || false && echo y; false || true && echo z",
    "! true; echo $?; ! false && echo negated",
    "{ echo a } always { echo b }; echo c",
    "f() echo in-f && echo also; f; echo out",
    "i=7; for i in 1 2; do :; done; echo $i; code=9; echo $code",
    "printf '1\\n2\\n' | while read -r n; do echo \"n=$n\"; done; echo after",
    "set -e; false && echo x; echo y",
    "set -e; echo a; false; echo b",
    "set -e; false || echo recovered; echo c",
    "find . -maxdepth 0 -exec echo {} \\; && echo {a,b}",
    "x=$(echo \"a;b\"); echo $x; echo \"$(echo \"q;q\")\"",
    "x='1;2'; [[ $x == *\";\"* ]] && echo m",
    "echo a |& cat; echo b &> /dev/null; echo c",
    "(echo in-sub; exit 4); echo $?",
    "echo \"\$(echo a; echo b)\" && printf '%s\\n' \"$(echo c; echo d)\"",
]


def test_the_runner_agrees_with_the_shell_on_every_line_of_the_corpus(tmp_path: Path):
    """Each line run whole by zsh and run in parts by the runner prints the same and ends with the same code."""
    (tmp_path / ".journal").mkdir()
    (tmp_path / ".journal" / "src").symlink_to(SRC)
    app = App(Config(tmp_path, port=0))
    app.container.get(Settings).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.runtime().start()
    try:
        port = app.server().port
        (tmp_path / ".journal" / "port").write_text(str(port))
        urlopen(Request(f"http://127.0.0.1:{port}/hooks/claude", data=json.dumps({"hook_event_name": "SessionStart", "session_id": "s1"}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
        env = {**os.environ, "JOURNAL_ROOT": str(tmp_path), "JOURNAL_ENV": "main", "CLAUDECODE": "1", "SHELL": "/bin/zsh"}
        runner, cwd = str(tmp_path / ".journal" / "src" / "journal" / "hooks" / "run.sh"), tmp_path / "cwd"
        differences = []
        for line in CORPUS:
            whole = subprocess.run(["/bin/zsh", "-c", line], cwd=tmp_path, capture_output=True, text=True, timeout=20)
            parts = subprocess.run([runner, wrapped(line, cwd)], env=env, cwd=tmp_path, capture_output=True, text=True, timeout=20)
            if (whole.stdout, whole.returncode) != (parts.stdout, parts.returncode):
                differences.append((line, whole.stdout, whole.returncode, parts.stdout, parts.returncode, parts.stderr[-200:]))
        assert not differences, "\n".join(repr(d) for d in differences)
    finally:
        app.runtime().stop()
