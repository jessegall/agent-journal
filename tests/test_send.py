import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from engine import drivers  # noqa: E402
from engine.drivers import RESUBMITS, Claude  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

drivers.time.sleep = lambda seconds: None


def typed(screens: list[str]) -> list[bytes]:
    read, write = os.pipe()
    driver = Claude(fresh(), "claude-1", fd=write)
    shown = iter(screens)
    driver.last_printed = lambda: next(shown, screens[-1])
    driver.send("3 new messages")
    os.close(write)
    out = os.read(read, 4096)
    os.close(read)
    return out.split(b"\r")[:-1]


check("an Enter that takes is pressed once", typed(["> 3 new messages\n\n❯ "]), [b"3 new messages"])
check("an Enter lost while the agent was busy is pressed again", typed(["❯ 3 new messages", "> 3 new messages\n❯ "]), [b"3 new messages", b""])
check("it gives up after a few tries rather than pressing forever", len(typed(["❯ 3 new messages"])), 1 + RESUBMITS)
check("a screen with no input box is not mistaken for unsent text", typed(["3 new messages were delivered"]), [b"3 new messages"])

done()
