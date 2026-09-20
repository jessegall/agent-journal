import sys
import tempfile
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from controllers.types import Notices  # noqa: E402
from engine import watch  # noqa: E402
from engine.record import Record  # noqa: E402
from tests.kit import check, done  # noqa: E402

root = Path(tempfile.mkdtemp()) / ".journal"
record = Record(root, "main")
notices = Notices(record)

# AN ENGINE THAT DIES THE MOMENT IT STARTS is a break, not a reload
check("a clean exit or a still-running engine is not a crash", [watch.crashed(code, time.time()) for code in (None, 0)], [False, False])
check("a failure the moment it started is", watch.crashed(1, time.time()), True)
check("a failure after it has been up a while is a reload, not a crash", watch.crashed(1, time.time() - watch.CRASH_WITHIN - 1), False)

# WHAT IT LEFT BEHIND is read from its log and handed to the user
watch.log_file(root).parent.mkdir(parents=True, exist_ok=True)
watch.log_file(root).write_text("Traceback (most recent call last):\nImportError: cannot import name 'MOST_STEPS'\n")
check("its last words are read back", "ImportError" in watch.why(root), True)
check("the user is told once, with what it said", (watch.told(root, "main", watch.why(root)), [n.title for n in notices.all()]),
      (True, [watch.TITLE]))
check("and not told again while it is still broken", (watch.told(root, "main", watch.why(root)), len(notices.all())), (False, 1))
check("the notice carries the error and asks for a fix", "ImportError" in notices.load(1).brief, True)

# ONCE IT RUNS AGAIN the notice is closed
watch.cleared(root, "main")
check("the notice is closed with why", (bool(notices.load(1).completed), notices.load(1).outcome), (True, "the engine is running again"))
check("a fresh break tells the user again", (watch.told(root, "main", "gone again"), len(notices.all())), (True, 2))

# AN ERROR MID-FLIGHT never stops the engine; it is told once and the agent hears it
class Driver:
    def __init__(self):
        self.said = []

    def alive(self):
        return True

    def send(self, text):
        self.said.append(text)


spoke = Driver()
watch.broke(record, "Traceback\nTypeError: bad", spoke)
told = [n for n in notices.all() if n.title == watch.FAULT]
check("an error while it runs raises its own notice and is typed to the agent",
      (len(told), "TypeError" in told[0].brief, "TypeError" in spoke.said[0]), (1, True, True))
watch.broke(record, "Traceback\nTypeError: bad", spoke)
check("the same trouble is not said twice", (len([n for n in notices.all() if n.title == watch.FAULT]), len(spoke.said)), (1, 1))
watch.broke(record, "Traceback\nValueError: something else", spoke)
check("a different error is its own notice, and is said too",
      (len([n for n in notices.all() if n.title == watch.FAULT]), len(spoke.said), "ValueError" in spoke.said[-1]), (2, 2, True))
watch.steady(record)
check("a stretch of clean ticks closes every fault it left behind",
      ([n.outcome for n in notices.all() if n.title == watch.FAULT], watch.broke(record, "Traceback\nTypeError: bad", spoke) or len(spoke.said)),
      ([watch.STEADY, watch.STEADY], 3))

done()
