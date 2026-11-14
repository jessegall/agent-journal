import json

import pytest

from engine.journal.journal_home import JournalHome
from engine.module.journal_container import sync_modules


@pytest.fixture
def home(tmp_path) -> JournalHome:
    home = JournalHome(tmp_path)
    home.module_list.parent.mkdir(parents=True, exist_ok=True)
    home.module_list.write_text(json.dumps([]))
    sync_modules(home)
    return home
