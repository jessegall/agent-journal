import importlib.util
from collections import Counter
from unittest.mock import Mock


MODULE = 'core.modules.helpers.support.program_shares'


def program_shares(values):
    assert importlib.util.find_spec(MODULE) is not None, 'ProgramShares is missing: the percent split has no counter yet'
    module = importlib.import_module(MODULE)
    settings = Mock()
    settings.texts.return_value = tuple(values)
    return module.ProgramShares(settings)


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
