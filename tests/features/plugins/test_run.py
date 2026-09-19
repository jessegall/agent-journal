import os
import sys
import tempfile
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
from features.plugins.run import CAP, call  # noqa: E402
from tests.kit import check, done  # noqa: E402

where = Path(tempfile.mkdtemp())
env = {"PATH": os.defpath}


def alive(pid: int) -> bool:
    try:
        os.kill(pid, 0)
    except OSError:
        return False
    return True


# A HANDLER READS THE EVENT ON STDIN and answers with one object
ok, reply = call("cat > event.json; echo '{\"whisper\": \"seen\"}'", where, env, {"event": "todo.created", "n": 7})
check("the event goes in as JSON and the answer comes back as an object", (ok, reply, "todo.created" in (where / "event.json").read_text()), (True, {"whisper": "seen"}, True))
check("a handler that says nothing has nothing to say", call("true", where, env, {}), (True, {}))
check("a command given as words is run without a shell", call(["sh", "-c", "echo '{\"say\": \"hi\"}'"], where, env, {}), (True, {"say": "hi"}))

# WHAT GOES WRONG is reported, never raised
ok, why = call("echo broken >&2; exit 2", where, env, {})
check("a handler that fails reports its last words", (ok, why), (False, "broken"))
ok, why = call("echo not json", where, env, {})
check("an answer that is not JSON is refused", (ok, why), (False, "the reply was not JSON: not json"))
check("an answer that is not an object is refused", call("echo '[1,2]'", where, env, {}), (False, "the reply was not an object"))
check("a command that cannot be run is reported", call(["/nope/at/all"], where, env, {})[0], False)

# A HANDLER THAT OVERRUNS is killed with everything it started
(where / "pid.txt").unlink(missing_ok=True)
ok, why = call("sh -c 'sleep 30 & echo $! > pid.txt; sleep 30'", where, env, {}, seconds=0.6)
child = int((where / "pid.txt").read_text().strip())
for _ in range(20):
    if not alive(child):
        break
    time.sleep(0.1)
check("it is reported as still running, and what it started is gone too", (ok, "still running after 0.6s" in why, alive(child)), (False, True, False))

# A HUGE ANSWER is cut before it is read
ok, why = call(f"python3 -c \"print('x' * {CAP * 2})\"", where, env, {}, seconds=20)
check("an answer past the cap is refused, not swallowed whole", (ok, len(why) < CAP), (False, True))

done()
