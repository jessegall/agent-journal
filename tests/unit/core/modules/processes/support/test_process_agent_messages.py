import string

import pytest

from core.modules.processes.support.process_agent_messages import PROCESS_AGENT_MESSAGES
from core.modules.processes.agent_messages.run_frozen_message import RunFrozenMessage
from core.modules.processes.agent_messages.run_sparse_message import RunSparseMessage
from core.modules.processes.agent_messages.silent_run_message import SilentRunMessage
from core.modules.processes.agent_messages.silent_run_blocked_message import SilentRunBlockedMessage
from core.modules.processes.agent_messages.stalled_run_message import StalledRunMessage

ALLOWED = {"output", "seconds", "limit", "hint", "name", "reader", "request", "count", "kept", "shape"}
LINE_COUNTS = {"processes.reader_missed", "processes.reader_too_wide"}
CADENCE_FIELDS = {"output", "seconds", "limit", "hint", "name"}

# Placeholders that exist today outside the allowed words; task 8838 (the rule 8 detector) judges and fixes them.
EXCEPTIONS = {
    "processes.silent_run_held": {"processor"},
    "processes.name_the_run": {"process"},
    "processes.process_lost": {"process"},
    "processes.output_check": {"minutes"},
    "processes.reader_request": {"agent"},
    "processes.reader_request_countdown": {"command", "remaining"},
    "processes.large_output_read": {"lines"},
    "processes.update_waiting": {"outputs"},
    "processes.shared_title": {"outputs"},
    "processes.output_progress": {"percent"},
    "processes.redirected_run": {"programs"},
    "processes.runner_missing": {"folder"},
    "processes.do_not_move": {"folder"},
}


def placeholders(declaration) -> set[str]:
    return {field for text in (declaration.text, declaration.plural_text) for _, field, _, _ in string.Formatter().parse(text) if field}


@pytest.mark.parametrize("declaration", PROCESS_AGENT_MESSAGES, ids=[declaration.key for declaration in PROCESS_AGENT_MESSAGES])
def test_every_process_agent_message_names_only_numbers_and_generic_words(declaration):
    allowed = ALLOWED | EXCEPTIONS.get(declaration.key, set()) | ({"lines"} if declaration.key in LINE_COUNTS else set())
    assert placeholders(declaration) <= allowed, placeholders(declaration) - allowed


def test_the_silent_run_hold_names_no_lines():
    assert "lines" not in placeholders(SilentRunBlockedMessage.declared())


@pytest.mark.parametrize("declaration", [RunSparseMessage.declared(), RunFrozenMessage.declared(), SilentRunMessage.declared(), StalledRunMessage.declared()], ids=["sparse", "frozen", "silent", "stalled"])
def test_the_cadence_notices_use_only_the_output_the_seconds_the_limit_the_hint_and_a_name(declaration):
    assert placeholders(declaration) <= CADENCE_FIELDS