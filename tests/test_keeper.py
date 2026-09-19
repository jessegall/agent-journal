import json
import os
import signal
import subprocess
import sys
import tempfile
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from engine.keeper import TAKEN  # noqa: E402
from engine.stored import read_json, write_json  # noqa: E402
from tests.kit import check, done  # noqa: E402

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


def alive(pid: int) -> bool:
    try:
        os.kill(pid, 0)
    except OSError:
        return False
    return True


def waiting(until, seconds: float = 10.0) -> bool:
    end = time.monotonic() + seconds
    while time.monotonic() < end:
        if until():
            return True
        time.sleep(0.05)
    return False


def spec(where: Path, run: str, name: str = "one") -> Path:
    path = where / f"{name}.json"
    write_json(path, {"run": run, "cwd": str(where), "env": {}, "lock": str(where / f"{name}.lock"),
                      "log": str(where / f"{name}.log"), "status": str(where / f"{name}-status.json"), "grace": 1, "owner": os.getpid()})
    return path


def keeper(path: Path, lifeline: int):
    return subprocess.Popen([sys.executable, str(HERE / "engine" / "keeper.py"), str(lifeline), str(path)],
                            pass_fds=(lifeline,) if lifeline >= 0 else (), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


where = Path(tempfile.mkdtemp())
(where / "standin.py").write_text(STANDIN)
pids = where / "pids.txt"

# THE LIFELINE CLOSING takes the service and everything it started
read, write = os.pipe()
os.set_inheritable(read, True)
kept = keeper(spec(where, f"{sys.executable} standin.py {pids}"), read)
check("the service starts and says what it spawned", waiting(lambda: pids.is_file()), True)
service, grandchild = (int(n) for n in pids.read_text().split())
check("its state is written for anyone to read", waiting(lambda: read_json(where / "one-status.json", {}).get("state") in ("starting", "ready")), True)
os.close(write)
os.close(read)
check("the keeper stops when the lifeline closes", kept.wait(timeout=15), 0)
check("the service and its own child are both gone", (waiting(lambda: not alive(service)), waiting(lambda: not alive(grandchild))), (True, True))
check("and it says it stopped", read_json(where / "one-status.json", {})["state"], "stopped")
check("what the service printed is in its log", "serving" in (where / "one.log").read_text(), True)

# AN OWNER KILLED OUTRIGHT still takes everything with it
pids.unlink()
owner = subprocess.Popen([sys.executable, "-c", f"""
import os, subprocess, sys, time
read, write = os.pipe()
os.set_inheritable(read, True)
subprocess.Popen([{sys.executable!r}, {str(HERE / 'engine' / 'keeper.py')!r}, str(read), {str(spec(where, f'{sys.executable} standin.py {pids}', 'two'))!r}], pass_fds=(read,))
time.sleep(120)
"""])
check("the owner's service is up", waiting(lambda: pids.is_file()), True)
service, grandchild = (int(n) for n in pids.read_text().split())
owner.kill()
owner.wait(timeout=10)
check("killing the owner outright still takes the service and its child", (waiting(lambda: not alive(service), 20), waiting(lambda: not alive(grandchild), 20)), (True, True))

# A SECOND KEEPER on the same service stands aside
read, write = os.pipe()
os.set_inheritable(read, True)
path = spec(where, f"{sys.executable} standin.py {where / 'three.txt'}", "three")
first = keeper(path, read)
check("the first one takes the lease", waiting(lambda: (where / "three.txt").is_file()), True)
second = keeper(path, read)
check("the second stands aside", second.wait(timeout=15), TAKEN)
os.close(write)
os.close(read)
first.wait(timeout=15)

# ASKED TO STOP, it stops the service and says so
read, write = os.pipe()
os.set_inheritable(read, True)
kept = keeper(spec(where, f"{sys.executable} standin.py {where / 'four.txt'}", "four"), read)
check("the service is up", waiting(lambda: (where / "four.txt").is_file()), True)
service = int((where / "four.txt").read_text().split()[0])
kept.send_signal(signal.SIGTERM)
check("a keeper told to stop ends cleanly and takes the service with it", (kept.wait(timeout=15), waiting(lambda: not alive(service))), (0, True))
os.close(write)
os.close(read)

done()
