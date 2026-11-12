import os

from engine.module.code_fingerprint import CodeFingerprint, PINNED_CODE_VARIABLE
from engine.testing.pytest_plugin import pinned_code_text
from tests.stories.support.story_checks import expect_value


def test_a_run_keeps_the_code_text_its_first_process_took(monkeypatch):
    monkeypatch.delenv(PINNED_CODE_VARIABLE, raising=False)
    first = pinned_code_text()
    os.environ[PINNED_CODE_VARIABLE] = first
    expect_value(pinned_code_text(), first)


def test_a_pinned_text_stands_for_the_journal_s_own_folders(monkeypatch):
    monkeypatch.setenv(PINNED_CODE_VARIABLE, "the-text-of-this-run")
    monkeypatch.setattr(CodeFingerprint, "kept_texts", {})
    expect_value(CodeFingerprint().text(()), CodeFingerprint.selected_text("the-text-of-this-run", ()))


def test_a_run_without_a_pinned_text_hashes_the_files(monkeypatch):
    monkeypatch.delenv(PINNED_CODE_VARIABLE, raising=False)
    monkeypatch.setattr(CodeFingerprint, "kept_texts", {})
    expect_value(CodeFingerprint().text(()) != CodeFingerprint.selected_text("the-text-of-this-run", ()), True)
