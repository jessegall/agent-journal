import sys
import threading
from collections import Counter
from pathlib import Path

from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome
from engine.time.clock import Clock

SWITCH_FILE = "cpu-profile-on"
REPORT_FILE = "cpu-profile.txt"
SAMPLE_SECONDS = 0.01
RUN_SECONDS = 60.0
LISTED_FUNCTIONS = 40
# a code file of the journal's own, as against the standard library: a server runs its code from .journal/versions
JOURNAL_CODE_MARK = "/versions/"
# the layers every read and file call goes through, passed so a caller names the code that asked
PASSED_LAYERS = ("/engine/database/", "/engine/query/", "/engine/file/", "/engine/model/")
# the frames a thread stands in while it waits, which take no CPU
IDLE_FUNCTIONS = frozenset({"wait", "select", "sleep", "accept", "poll", "readinto", "recv_into", "serve_forever", "_wait_for_tstate_lock", "get_request"})


class CpuSampler:
    """Finds what keeps the server's CPU busy: once a person drops the switch file into the runtime folder, a thread
    samples every other thread's stack for a minute and writes the functions seen most, as the ones running and as
    the ones on the stack, and each running function with the nearest journal function that called it, to the report
    file, and takes the switch file away."""

    def __init__(self, home: JournalHome, clock: Clock) -> None:
        self.home, self.clock = home, clock
        self.running = threading.Event()

    def follow(self) -> None:
        if self.running.is_set() or not FileAccess.exists(self.switch_file):
            return
        self.running.set()
        threading.Thread(target=self.sampled, name="cpu sampler", daemon=True).start()

    @property
    def switch_file(self) -> Path:
        return self.home.folder / "runtime" / SWITCH_FILE

    def sampled(self) -> None:
        running, on_stack, callers, samples = Counter[str](), Counter[str](), Counter[str](), 0
        own = threading.get_ident()
        for _ in range(int(RUN_SECONDS / SAMPLE_SECONDS)):
            for ident, frame in sys._current_frames().items():
                if ident == own or frame.f_code.co_name in IDLE_FUNCTIONS:
                    continue
                running[self.label(frame)] += 1
                callers[f"{self.label(frame)} <- {self.journal_caller(frame)}"] += 1
                seen: set[str] = set()
                while frame is not None:
                    seen.add(self.label(frame))
                    frame = frame.f_back
                on_stack.update(seen)
            samples += 1
            self.clock.sleep(SAMPLE_SECONDS)
        FileAccess.write(self.home.folder / "runtime" / REPORT_FILE, self.report(running, on_stack, callers, samples))
        FileAccess.unlink(self.switch_file, missing_ok=True)
        self.running.clear()

    @staticmethod
    def label(frame: object) -> str:
        code = frame.f_code  # type: ignore[attr-defined]
        return f"{Path(code.co_filename).name}:{code.co_firstlineno} {code.co_name}"

    # the first frame of the journal's own code from the running one outward, past its database, query and file layers,
    # so a read or a file call shows the code that asked for it
    @staticmethod
    def journal_caller(frame: object) -> str:
        caller = frame.f_back  # type: ignore[attr-defined]
        while caller is not None and (JOURNAL_CODE_MARK not in caller.f_code.co_filename or any(layer in caller.f_code.co_filename for layer in PASSED_LAYERS)):
            caller = caller.f_back
        return "none" if caller is None else CpuSampler.label(caller)

    @staticmethod
    def report(running: Counter[str], on_stack: Counter[str], callers: Counter[str], samples: int) -> str:
        lines = [f"{samples} samples over {RUN_SECONDS:.0f} seconds; a count is the samples a busy thread stood there", "", "running:"]
        lines += [f"{count:6d} {name}" for name, count in running.most_common(LISTED_FUNCTIONS)]
        lines += ["", "on the stack:"] + [f"{count:6d} {name}" for name, count in on_stack.most_common(LISTED_FUNCTIONS)]
        lines += ["", "running, with the journal function that called it:"] + [f"{count:6d} {name}" for name, count in callers.most_common(LISTED_FUNCTIONS)]
        return "\n".join(lines) + "\n"
