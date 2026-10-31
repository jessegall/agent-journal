import hashlib
from pathlib import Path

import pytest

COPY_TEXT = "from tests.unit.core.base.samples.sync_sample import ItemsModule\n\n\nclass CopiedItemsModule(ItemsModule):\n    pass\n"


def items_module_copy(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> tuple[str, Path]:
    folder = tmp_path / "code"
    folder.mkdir()
    module_name = "copied_items_" + hashlib.sha256(str(tmp_path).encode()).hexdigest()[:12]
    copy = folder / f"{module_name}.py"
    copy.write_text(COPY_TEXT)
    monkeypatch.syspath_prepend(str(folder))
    return f"{module_name}:CopiedItemsModule", copy
