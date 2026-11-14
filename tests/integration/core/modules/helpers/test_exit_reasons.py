from types import SimpleNamespace
from unittest.mock import Mock

import pytest

from engine.journal.journal_home import JournalHome
from engine.provider.helper_outcome import HelperOutcome
from core.modules.helpers.support.exit_reasons import ExitReasons


@pytest.fixture
def exit_reason(tmp_path):
    providers = Mock()
    providers.provider.return_value.helper_outcome.return_value = HelperOutcome('', '')
    reasons = ExitReasons(JournalHome(tmp_path), providers)
    return reasons, providers


@pytest.mark.parametrize('terminal,reason', [
    ('API Error: 429 rate limit reached', 'it hit a rate limit'),
    ('Please run /login', 'its login expired'),
    ('Error: unknown model gpt-9', ''),
    ('The fixture prints "API Error: 429 rate limit reached" as sample data.\nAssertionError: bad cart total', ''),
    ('Application request failed: HTTP 429 from cart.example.test\nAssertionError: retry test', ''),
    ('Old output: Please run /login\nThe current job failed: AssertionError', ''),
    ('API Error: 429 rate limit reached\nTask finished successfully', ''),
])
def test_program_problem_only_reads_current_provider_failure(exit_reason, terminal, reason):
    reasons, _ = exit_reason
    assert reasons.program_problem(SimpleNamespace(id=1, program='sample'), terminal) == reason


def test_structured_error_is_used(exit_reason):
    reasons, providers = exit_reason
    providers.provider.return_value.helper_outcome.return_value = HelperOutcome('', '', 'Too many requests')
    assert reasons.program_problem(SimpleNamespace(id=1, program='sample'), '{"error": "provider failure"}') == 'it hit a rate limit'
