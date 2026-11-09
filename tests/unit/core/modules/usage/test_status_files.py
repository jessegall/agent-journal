from core.base.clock import Clock
import json
import os
from datetime import datetime, timezone

from core.base.journal_home import JournalHome
from core.base.timestamp import Timestamp
from core.modules.usage.support.status_files import StatusFiles


CHECKED_AT = Timestamp(datetime(2026, 11, 6, 9, tzinfo=timezone.utc))


def save_status(folder, session, percent, modified_at):
    folder.mkdir(parents=True, exist_ok=True)
    path = folder / f'{session}.json'
    path.write_text(json.dumps({'rate_limits': {'five_hour': {'used_percentage': percent, 'resets_at': CHECKED_AT.value.timestamp() + 3600}}}))
    os.utime(path, (modified_at, modified_at))


def test_newest_program_reading_wins(tmp_path):
    files = StatusFiles(JournalHome(tmp_path), Clock())
    save_status(files.folder, 'old', 99, CHECKED_AT.value.timestamp() - 20)
    save_status(files.folder, 'new', 20, CHECKED_AT.value.timestamp() - 10)
    save_status(files.folder, 'other-program', 100, CHECKED_AT.value.timestamp())
    assert files.newest_status(['old', 'new'], CHECKED_AT).windows[0].used_percent == 20


def test_stale_status_is_ready_even_with_future_reset(tmp_path):
    files = StatusFiles(JournalHome(tmp_path), Clock())
    save_status(files.folder, 'stale', 99, CHECKED_AT.value.timestamp() - 86400)
    assert files.newest_status(['stale'], CHECKED_AT).windows == ()


def test_missing_status_has_no_windows(tmp_path):
    assert StatusFiles(JournalHome(tmp_path), Clock()).newest_status(['missing'], CHECKED_AT).windows == ()
