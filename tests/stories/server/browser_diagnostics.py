import subprocess
from unittest.mock import Mock

import pytest

from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.browser_story import BrowserStoryTimeout
from tests.stories.server.support.server_client import ServerStory


@pytest.mark.parametrize("output", [b"before navigation\n", "before navigation\n", None])
def test_a_browser_timeout_keeps_the_script_output_and_playwright_action(monkeypatch, output):
    story = Mock(spec=ServerStory)
    story.viewer_key.return_value = "test-key"
    story.viewer_port.return_value = 1234
    run = Mock(side_effect=subprocess.TimeoutExpired("node", 60, output=output, stderr=b"pw:api waiting for locator\n"))
    monkeypatch.setattr(subprocess, "run", run)
    with pytest.raises(AssertionError, match="waiting for locator") as failure:
        expect_browser(story, "example.browser.mjs", [])
    expect_failure_with_2(failure, "example.browser.mjs")
    if output is not None:
        expect_failure_with_2(failure, "before navigation")
    expect_debug_variables(run, "pw:api")


def test_a_browser_timeout_can_report_missing_output_and_invalid_bytes():
    error = subprocess.TimeoutExpired("node", 60, stderr=b"last action \xff")
    failure = BrowserStoryTimeout.with_script("example.browser.mjs", error)
    expect_failure_with(failure, "last action \ufffd")
    expect_failure_with(failure, "stdout:\n\nstderr:")


def expect_failure_with(failure, expected) -> None:
    actual = str(failure)
    assert expected in actual, actual


def expect_debug_variables(run, expected) -> None:
    actual = run.call_args.kwargs['env']['DEBUG']
    assert expected in actual, actual


def expect_failure_with_2(failure, expected) -> None:
    actual = str(failure.value)
    assert expected in actual, actual
