import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from v2.engine.drivers import DRIVERS  # noqa: E402
from v2.engine.engine import Engine  # noqa: E402
from v2.engine.record import Record  # noqa: E402

root, env, agent, fd, session = sys.argv[1:6]
record = Record(Path(root), env)
Engine(record, DRIVERS[agent](record, session, fd=int(fd))).run()
