from datetime import datetime, timedelta, timezone
from contextlib import nullcontext
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import Mock

import pytest

from engine.provider.hook_trust import HookTrust
from engine.provider.unknown_program_error import UnknownProgramError
from engine.errors.refusal import Refusal
from engine.time.timestamp import Timestamp
from core.modules.helpers.support.program_states import ProgramStates


@pytest.fixture
def readiness():
    now = Timestamp(datetime(2026, 11, 6, 9, tzinfo=timezone.utc))
    provider = Mock(name='sample')
    provider.name = 'sample'
    provider.hook_trust.return_value = HookTrust.READY
    providers, programs, queries, settings, statuses, clock = (Mock() for _ in range(6))
    providers.provider.return_value = provider
    providers.all.return_value = [provider]
    queries.query.return_value.filter.return_value.descending.return_value.all_rows.return_value = []
    agents, scopes = Mock(), Mock()
    agents.running.return_value.filter.return_value.all_rows.return_value = [SimpleNamespace(session='open')]
    scopes.opened.return_value = nullcontext()
    settings.number.return_value = 95
    statuses.newest_status.return_value = SimpleNamespace(windows=())
    clock.timestamp.return_value = now
    kept_rows, limits = Mock(), Mock()
    limits.reached_limit_ends.return_value = None
    kept_rows.scoped_read.side_effect = lambda table, loader, *args, **kwargs: loader()
    kept_rows.read.side_effect = kept_rows.scoped_read.side_effect
    states = ProgramStates(providers, programs, queries, settings, statuses, clock, agents, scopes, kept_rows, limits)
    return SimpleNamespace(states=states, provider=provider, providers=providers, programs=programs,
                           queries=queries, settings=settings, statuses=statuses, clock=clock, now=now)


def test_missing_executable_is_out_before_trust(readiness):
    readiness.programs.installed.side_effect = Refusal('sample is not installed here')
    state = readiness.states.state('sample', Path('/project'))
    assert not state.is_ready and 'not installed' in state.line
    readiness.provider.hook_trust.assert_not_called()


def test_untrusted_hooks_are_out(readiness):
    readiness.provider.hook_trust.return_value = HookTrust.UNTRUSTED
    state = readiness.states.state('sample', Path('/project'))
    assert not state.is_ready and '/project' in state.line
    readiness.statuses.newest_status.assert_not_called()


def test_current_outage_gives_reason_and_end(readiness):
    ends_at = Timestamp(readiness.now.value + timedelta(minutes=15))
    readiness.queries.query.return_value.filter.return_value.descending.return_value.all_rows.return_value = [SimpleNamespace(reason='rate limit', ends_at=ends_at)]
    state = readiness.states.state('sample', Path('/project'))
    assert not state.is_ready and state.line == 'rate limit' and state.ends_at == ends_at


def test_expired_outage_is_ready_without_deleting_history(readiness):
    query = readiness.queries.query.return_value.filter.return_value.descending.return_value
    query.all_rows.return_value = [SimpleNamespace(reason='rate limit', ends_at=readiness.now)]
    assert readiness.states.state('sample', Path('/project')).is_ready
    assert len(query.all_rows.return_value) == 1


@pytest.mark.parametrize('percent,is_ready', [(94, True), (95, False), (96, False)])
def test_plan_window_threshold(readiness, percent, is_ready):
    resets_at = readiness.now.value.timestamp() + 3600
    readiness.statuses.newest_status.return_value = SimpleNamespace(windows=[SimpleNamespace(used_percent=percent, reset_epoch_seconds=resets_at, line='plan window')])
    state = readiness.states.state('sample', Path('/project'))
    assert state.is_ready is is_ready
    if not is_ready:
        assert state.ends_at.value.timestamp() == resets_at


@pytest.mark.parametrize('reset_seconds', [0, -1])
def test_program_states_copes_with_past_reset(readiness, reset_seconds):
    readiness.statuses.newest_status.return_value = SimpleNamespace(windows=[SimpleNamespace(used_percent=99, reset_epoch_seconds=readiness.now.value.timestamp() + reset_seconds)])
    assert readiness.states.state('sample', Path('/project')).is_ready


def test_no_status_reading_is_ready(readiness):
    assert readiness.states.state('sample', Path('/project')).is_ready
    readiness.statuses.newest_status.assert_called_with(['open'], readiness.now)


def test_removed_program_is_out_without_raising(readiness):
    readiness.providers.provider.side_effect = UnknownProgramError('gone')
    state = readiness.states.state('gone', Path('/project'))
    assert not state.is_ready and 'provider module' in state.line
    readiness.programs.installed.assert_not_called()


def test_zero_threshold_disables_window_reading(readiness):
    readiness.settings.number.return_value = 0
    assert readiness.states.state('sample', Path('/project')).is_ready


def test_ready_programs_only_lists_ready_programs(readiness):
    assert readiness.states.ready_programs(Path('/project')) == tuple(['sample'])
    readiness.programs.installed.side_effect = Refusal('not installed')
    assert readiness.states.ready_programs(Path('/project')) == ()


def test_earliest_line_names_the_time(readiness):
    ends_at = Timestamp(readiness.now.value + timedelta(minutes=15))
    readiness.queries.query.return_value.filter.return_value.descending.return_value.all_rows.return_value = [SimpleNamespace(reason='rate limit', ends_at=ends_at)]
    assert ends_at.text in readiness.states.earliest_line(Path('/project'))


def test_state_listing_serializes_end_time(readiness):
    state = readiness.states.state('sample', Path('/project'))
    assert state.listed() == {'is_ready': True, 'line': 'ready', 'ends_at': None}
