import os
import time

from features.plugins.run import CAP, call


def alive(pid):
    try:
        os.kill(pid, 0)
    except OSError:
        return False
    return True


def test_a_handler_reads_the_event_on_stdin_and_answers_with_one_object(tmp_path):
    env = {"PATH": os.defpath}
    ok, reply = call("cat > event.json; echo '{\"whisper\": \"seen\"}'", tmp_path, env, {"event": "todo.created", "n": 7})
    assert (ok, reply, "todo.created" in (tmp_path / "event.json").read_text()) == (True, {"whisper": "seen"}, True), \
        "the event goes in as JSON and the answer comes back as an object"
    assert call("true", tmp_path, env, {}) == (True, {}), "a handler that says nothing has nothing to say"
    assert call(["sh", "-c", "echo '{\"say\": \"hi\"}'"], tmp_path, env, {}) == (True, {"say": "hi"}), \
        "a command given as words is run without a shell"


def test_what_goes_wrong_is_reported_never_raised(tmp_path):
    env = {"PATH": os.defpath}
    ok, why = call("echo broken >&2; exit 2", tmp_path, env, {})
    assert (ok, why) == (False, "broken"), "a handler that fails reports its last words"
    ok, why = call("echo not json", tmp_path, env, {})
    assert (ok, why) == (False, "the reply was not JSON: not json"), "an answer that is not JSON is refused"
    assert call("echo '[1,2]'", tmp_path, env, {}) == (False, "the reply was not an object"), \
        "an answer that is not an object is refused"
    assert call(["/nope/at/all"], tmp_path, env, {})[0] is False, "a command that cannot be run is reported"


def test_a_handler_that_overruns_is_killed_with_everything_it_started(tmp_path):
    env = {"PATH": os.defpath}
    (tmp_path / "pid.txt").unlink(missing_ok=True)
    ok, why = call("sh -c 'sleep 30 & echo $! > pid.txt; sleep 30'", tmp_path, env, {}, seconds=0.6)
    child = int((tmp_path / "pid.txt").read_text().strip())
    for _ in range(20):
        if not alive(child):
            break
        time.sleep(0.1)
    assert (ok, "still running after 0.6s" in why, alive(child)) == (False, True, False), \
        "it is reported as still running, and what it started is gone too"


def test_a_huge_answer_is_cut_before_it_is_read(tmp_path):
    env = {"PATH": os.defpath}
    ok, why = call(f"python3 -c \"print('x' * {CAP * 2})\"", tmp_path, env, {}, seconds=20)
    assert (ok, len(why) < CAP) == (False, True), "an answer past the cap is refused, not swallowed whole"
