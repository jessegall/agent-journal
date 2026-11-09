from core.base.clock import Clock
import json
from pathlib import Path

import pytest

from core.modules.plugins.support.plugin_queue import PluginQueue


@pytest.mark.parametrize("read", [lambda queue: queue.reserve("main", 1, "firing", [], Clock()), lambda queue: list(queue.claim_cards())],
                         ids=["reserve", "claim-cards"])
@pytest.mark.parametrize("method", ["stat", "open"])
def test_a_file_that_vanishes_after_the_listing_is_skipped(tmp_path, monkeypatch, read, method):
    queue = PluginQueue(tmp_path)
    queue.folder.mkdir()
    path = queue.folder / "answer.json"
    path.write_text(json.dumps({"env": "main", "agent": 1, "cards": [{"key": "card", "kind": "state", "label": "Done"}]}))
    original = getattr(Path, method)

    def remove_file(source, *arguments, **options):
        if source in (path, path.with_suffix(".claimed")):
            source.unlink(missing_ok=True)
        return original(source, *arguments, **options)

    monkeypatch.setattr(Path, method, remove_file)
    read(queue)
