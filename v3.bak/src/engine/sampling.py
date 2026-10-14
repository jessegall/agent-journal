import sys
import threading
import time
from collections import Counter
from pathlib import Path

INTERVAL = 0.01
SECONDS = 60
SHOWN = 25


class Sampler:
    """Looks at where every thread of this process is, many times a second, and says which functions the time goes to."""

    def __init__(self) -> None:
        self.samples: Counter = Counter()
        self.at_top: Counter = Counter()
        self.within: Counter = Counter()

    def look(self) -> None:
        names = {thread.ident: thread.name for thread in threading.enumerate()}
        for ident, frame in sys._current_frames().items():
            if ident == threading.get_ident():
                continue
            thread = names.get(ident, str(ident))
            self.samples[thread] += 1
            self.at_top[thread, self.named(frame)] += 1
            for each in {self.named(f) for f in self.frames(frame)}:
                self.within[thread, each] += 1

    @staticmethod
    def frames(frame):
        while frame is not None:
            yield frame
            frame = frame.f_back

    @staticmethod
    def named(frame) -> str:
        code = frame.f_code
        return f"{code.co_filename.rsplit('/src/', 1)[-1].rsplit('journal.pyz/', 1)[-1]}:{code.co_name}"

    def run(self, seconds: float = SECONDS, every: float = INTERVAL) -> str:
        ends = time.monotonic() + seconds
        while time.monotonic() < ends:
            self.look()
            time.sleep(every)
        return self.report(seconds)

    def report(self, seconds: float) -> str:
        lines = [f"{seconds:g} seconds, a look every {INTERVAL * 1000:g} ms; each count is the looks that found the thread there"]
        for thread, looks in self.samples.most_common():
            lines += [f"\n== thread {thread}: {looks} looks", "-- where it was at the moment of a look"]
            lines += self.counted(self.at_top, thread, SHOWN)
            lines += ["-- what it was inside of (every function on its stack)"]
            lines += self.counted(self.within, thread, SHOWN * 2)
        return "\n".join(lines) + "\n"

    @staticmethod
    def counted(counts: Counter, thread: str, shown: int) -> list[str]:
        return [f"{count:6d}  {name}" for (owner, name), count in counts.most_common() if owner == thread][:shown]


def profile_when_asked(root: Path, env: str) -> None:
    """kill -USR2 on an engine's process makes it look at itself for a minute and write what it found to runtime/engine-profile-<environment>.txt."""
    import signal
    from engine import runtime

    def profiled() -> None:
        found = Sampler().run()
        (runtime.folder(root) / f"engine-profile-{env}.txt").write_text(found)

    signal.signal(signal.SIGUSR2, lambda *_: threading.Thread(target=profiled, name="profile", daemon=True).start())
