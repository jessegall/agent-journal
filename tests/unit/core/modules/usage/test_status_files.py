import json
import os
from datetime import datetime, timezone

from core.base.journal_home import JournalHome
from core.base.timestamp import Timestamp
from core.modules.usage.support.status_files import StatusFiles


NOW = Timestamp(datetime(2026, 11, 6, 9, tzinfo=timezone.utc))


def write_reading(folder, session, percent, modified_at):
    folder.mkdir(parents=True, exist_ok=True)
    path = folder / f'{session}.json'
    path.write_text(json.dumps({'rate_limits': {'five_hour': {'used_percentage': percent, 'resets_at': NOW.value.timestamp() + 3600}}}))
    os.utime(path, (modified_at, modified_at))


def test_newest_program_reading_wins(tmp_path):
    files = StatusFiles(JournalHome(tmp_path))
    write_reading(files.folder, 'old', 99, NOW.value.timestamp() - 20)
    write_reading(files.folder, 'new', 20, NOW.value.timestamp() - 10)
    write_reading(files.folder, 'other-program', 100, NOW.value.timestamp())
    assert files.newest_status(['old', 'new'], NOW).windows[0].used_percent == 20


def test_stale_status_is_ready_even_with_future_reset(tmp_path):
    files = StatusFiles(JournalHome(tmp_path))
    write_reading(files.folder, 'stale', 99, NOW.value.timestamp() - 86400)
    assert files.newest_status(['stale'], NOW).windows == ()


def test_missing_status_has_no_windows(tmp_path):
    assert StatusFiles(JournalHome(tmp_path)).newest_status(['missing'], NOW).windows == ()
