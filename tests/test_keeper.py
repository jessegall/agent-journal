import os
import signal
import subprocess
import sys
import time
from pathlib import Path

from engine.keeper import TAKEN
from engine.stored import read_json, write_json

HERE = Path(__file__).resolve().parents[1]
STANDIN = """
import os, sys, time
from pathlib import Path
where = Path(sys.argv[1])
child = os.fork()
if child == 0:
    time.sleep(120)
    sys.exit(0)
where.write_text(f"{os.getpid()} {child}")
print("serving", flush=True)
time.sleep(120)
"""


def alive(pid):
    try:
        os.kill(pid, 0)
    except OSError:
        return False
    return True


def waiting(until, seconds=10.0):
    end = time.monotonic() + seconds
    while time.monotonic() < end:
        if until():
            return True
        time.sleep(0.05)
    return False


def spec(where, run, name="one"):
    path = where / f"{name}.json"
    write_json(path, {"run": run, "cwd": str(where), "env": {}, "lock": str(where / f"{name}.lock"),
                      "log": str(where / f"{name}.log"), "status": str(where / f"{name}-status.json"), "grace": 1, "owner": os.getpid()})
    return path


def keeper(path, lifeline):
    return subprocess.Popen([sys.executable, str(HERE / "engine" / "keeper.py"), str(lifeline), str(path)],
                            pass_fds=(lifeline,) if lifeline >= 0 else (), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def test_the_lifeline_closing_takes_the_service_and_everything_it_started(tmp_path):
    (tmp_path / "standin.py").write_text(STANDIN)
    pids = tmp_path / "pids.txt"

    read, write = os.pipe()
    os.set_inheritable(read, True)
    kept = keeper(spec(tmp_path, f"{sys.executable} standin.py {pids}"), read)
    assert waiting(lambda: pids.is_file()) is True, "the service starts and says what it spawned"
    service, grandchild = (int(n) for n in pids.read_text().split())
    assert waiting(lambda: read_json(tmp_path / "one-status.json", {}).get("state") in ("starting", "ready")) is True, \
        "its state is written for anyone to read"
    os.close(write)
    os.close(read)
    assert kept.wait(timeout=15) == 0, "the keeper stops when the lifeline closes"
    assert (waiting(lambda: not alive(service)), waiting(lambda: not alive(grandchild))) == (True, True), \
        "the service and its own child are both gone"
    assert read_json(tmp_path / "one-status.json", {})["state"] == "stopped", "and it says it stopped"
    assert "serving" in (tmp_path / "one.log").read_text(), "what the service printed is in its log"


def test_an_owner_killed_outright_still_takes_everything_with_it(tmp_path):
    (tmp_path / "standin.py").write_text(STANDIN)
    pids = tmp_path / "pids.txt"

    owner = subprocess.Popen([sys.executable, "-c", f"""
import os, subprocess, sys, time
read, write = os.pipe()
os.set_inheritable(read, True)
subprocess.Popen([{sys.executable!r}, {str(HERE / 'engine' / 'keeper.py')!r}, str(read), {str(spec(tmp_path, f'{sys.executable} standin.py {pids}', 'two'))!r}], pass_fds=(read,))
time.sleep(120)
"""])
    assert waiting(lambda: pids.is_file()) is True, "the owner's service is up"
    service, grandchild = (int(n) for n in pids.read_text().split())
    owner.kill()
    owner.wait(timeout=10)
    assert (waiting(lambda: not alive(service), 20), waiting(lambda: not alive(grandchild), 20)) == (True, True), \
        "killing the owner outright still takes the service and its child"


def test_a_second_keeper_on_the_same_service_stands_aside(tmp_path):
    (tmp_path / "standin.py").write_text(STANDIN)
    read, write = os.pipe()
    os.set_inheritable(read, True)
    path = spec(tmp_path, f"{sys.executable} standin.py {tmp_path / 'three.txt'}", "three")
    first = keeper(path, read)
    try:
        assert waiting(lambda: (tmp_path / "three.txt").is_file()) is True, "the first one takes the lease"
        second = keeper(path, read)
        assert second.wait(timeout=15) == TAKEN, "the second stands aside"
    finally:
        os.close(write)
        os.close(read)
        first.wait(timeout=15)


def test_asked_to_stop_it_stops_the_service_and_says_so(tmp_path):
    (tmp_path / "standin.py").write_text(STANDIN)
    read, write = os.pipe()
    os.set_inheritable(read, True)
    kept = keeper(spec(tmp_path, f"{sys.executable} standin.py {tmp_path / 'four.txt'}", "four"), read)
    try:
        assert waiting(lambda: (tmp_path / "four.txt").is_file()) is True, "the service is up"
        service = int((tmp_path / "four.txt").read_text().split()[0])
        kept.send_signal(signal.SIGTERM)
        assert (kept.wait(timeout=15), waiting(lambda: not alive(service))) == (0, True), \
            "a keeper told to stop ends cleanly and takes the service with it"
    finally:
        os.close(write)
        os.close(read)
