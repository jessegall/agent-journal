import importlib.util
from collections import Counter
from types import SimpleNamespace
from datetime import datetime, timezone
from unittest.mock import Mock
from engine.time.timestamp import Timestamp


MODULE = 'core.modules.helpers.support.program_shares'


def program_shares(values):
    assert importlib.util.find_spec(MODULE) is not None, 'ProgramShares is missing: the percent split has no counter yet'
    module = importlib.import_module(MODULE)
    settings = Mock()
    settings.texts.return_value = tuple(values)
    providers, rows, scopes = Mock(), Mock(), Mock()
    providers.all.return_value = [SimpleNamespace(name=name) for name in ['claude', 'codex']]
    rows.row.return_value = None
    scopes.environment_id = 1
    return module.ProgramShares(settings, providers, rows, scopes)


def test_split_gives_the_thirteen_task_sequence():
    shares = program_shares(['claude 80', 'codex 20'])
    counts = Counter()
    choices = []
    for _ in range(13):
        program = shares.next_program(counts, ['claude', 'codex'])
        choices.append(program)
        counts[program] += 1
    assert choices == ['claude', 'claude', 'codex', 'claude', 'claude', 'claude', 'claude', 'codex', 'claude', 'claude', 'claude', 'claude', 'codex']


def test_split_gives_the_thirteen_task_sequence_zero_share_gets_nothing():
    shares = program_shares(['claude 100', 'codex 0'])
    assert shares.next_program({'claude': 50}, ['claude', 'codex']) == 'claude'


def test_split_gives_the_thirteen_task_sequence_removed_program_is_ignored():
    shares = program_shares(['claude 80', 'gone 20'])
    assert shares.next_program({'claude': 4}, ['claude', 'codex']) == 'claude'


def test_removed_provider_is_not_listed_in_shares():
    shares = program_shares(['claude 80', 'gone 20'])
    assert shares.shares() == {'claude': 80}


def test_empty_split_is_not_configured():
    shares = program_shares([])
    assert not shares.is_configured
    assert shares.next_program({}, ['claude', 'codex']) is None


def test_configured_split_with_no_ready_share_has_no_choice():
    shares = program_shares(['claude 0', 'codex 100'])
    assert shares.is_configured
    assert shares.next_program({}, ['claude']) is None


def test_split_counts_only_since_it_changed_uses_environment_override():
    shares = program_shares(['claude 50', 'codex 50'])
    changed_at = Timestamp(datetime(2026, 11, 6, tzinfo=timezone.utc))
    shares.rows.row.return_value = SimpleNamespace(update_timestamp=lambda: changed_at)
    assert shares.changed_at() == changed_at
    assert shares.rows.row.call_args.args[2] == 1


def test_split_counts_only_since_it_changed_uses_project_fallback():
    shares = program_shares(['claude 50', 'codex 50'])
    changed_at = Timestamp(datetime(2026, 11, 6, tzinfo=timezone.utc))
    shares.rows.row.side_effect = [None, SimpleNamespace(update_timestamp=lambda: changed_at)]
    assert shares.changed_at() == changed_at
    assert shares.rows.row.call_args.args[2] is None


def test_unset_split_has_no_change_timestamp():
    assert program_shares([]).changed_at() is None
