import os

from engine import drivers
from engine.drivers import RESUBMITS, Claude
from tests.conftest import fresh

drivers.time.sleep = lambda seconds: None


def typed(screens):
    read, write = os.pipe()
    driver = Claude(fresh(), "claude-1", fd=write)
    shown = iter(screens)
    driver.last_printed = lambda: next(shown, screens[-1])
    driver.send("3 new messages")
    os.close(write)
    out = os.read(read, 4096)
    os.close(read)
    return out.split(b"\r")[:-1]


def test_an_enter_that_takes_is_pressed_once():
    assert typed(["> 3 new messages\n\n❯ "]) == [b"3 new messages"], "an Enter that takes is pressed once"


def test_an_enter_lost_while_the_agent_was_busy_is_pressed_again():
    assert typed(["❯ 3 new messages", "> 3 new messages\n❯ "]) == [b"3 new messages", b""], \
        "an Enter lost while the agent was busy is pressed again"


def test_it_gives_up_after_a_few_tries_rather_than_pressing_forever():
    assert len(typed(["❯ 3 new messages"])) == 1 + RESUBMITS, "it gives up after a few tries rather than pressing forever"


def test_a_screen_with_no_input_box_is_not_mistaken_for_unsent_text():
    assert typed(["3 new messages were delivered"]) == [b"3 new messages"], \
        "a screen with no input box is not mistaken for unsent text"
