import gc
import threading
import time

_thread = threading.local()


def _timed(phase: str, info: dict) -> None:
    if phase == "start":
        _thread.began = time.thread_time()
        return
    _thread.spent = collecting() + time.thread_time() - getattr(_thread, "began", time.thread_time())


def collecting() -> float:
    return getattr(_thread, "spent", 0.0)


gc.callbacks.append(_timed)
