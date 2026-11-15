from pathlib import Path
from types import SimpleNamespace

from core.modules.helpers.rules.helper_report_rule import HelperReportRule

HELPER = SimpleNamespace(id=4, session="s-helper")


class TranscriptProgram:
    """The providers of one program whose transcript's last reply is the given text."""

    def __init__(self, transcript_reply: str) -> None:
        self.transcript_reply = transcript_reply

    def provider(self, program: str):
        return SimpleNamespace(last_reply=lambda folder, session: self.transcript_reply)


class HelperFolders:
    def folder(self, helper) -> Path:
        return Path("/p")


def report(body: dict[str, object], transcript_reply: str = "from the transcript") -> str:
    rule = HelperReportRule(None, None, TranscriptProgram(transcript_reply), HelperFolders())  # type: ignore[arg-type]
    hook = SimpleNamespace(event=SimpleNamespace(raw=body, program="claude"))
    return rule.report(hook, HELPER)  # type: ignore[arg-type]


def test_the_report_is_the_stop_hooks_last_message_when_it_has_one():
    assert report({"last_assistant_message": "  Done: 3 tasks closed.  "}) == "Done: 3 tasks closed."


def test_the_report_falls_back_to_the_transcript_when_the_body_has_none():
    assert report({}) == "from the transcript" and report({"last_assistant_message": ""}) == "from the transcript"
