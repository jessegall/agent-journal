import json
from pathlib import Path
import sqlite3

from tests.stories.core.modules.plugins.support.plugin_samples import MANIFEST, PROGRAM, sample_plugin_folder

PLUGIN_NAME = "code-commandments"
INSTALLED_VERSION = "6.26.0"
OFFERED_VERSION = "6.27.0"


def plugin_folder(journal_folder: Path) -> None:
    folder = sample_plugin_folder(journal_folder / "plugins")
    folder.rename(folder.with_name(PLUGIN_NAME))
    prepare_plugin_files(folder.with_name(PLUGIN_NAME), INSTALLED_VERSION)


def prepare_plugin_files(folder: Path, version: str) -> None:
    (folder / "journal-plugin.json").write_text(json.dumps({**MANIFEST, "name": PLUGIN_NAME, "version": version, "journal": "4.62.0"}))
    (folder / "run.sh").write_text(PROGRAM.replace("rm -rf", "touch protected"))


def disabled_plugin_folder(journal_folder: Path) -> None:
    plugin_folder(journal_folder)
    with sqlite3.connect(journal_folder / "journal.db") as connection:
        connection.execute("UPDATE plugins SET is_user_disabled = 1 WHERE name = ?", tuple([PLUGIN_NAME]))


def upgradable_plugin_folder(journal_folder: Path) -> None:
    plugin_folder(journal_folder)
    offered = sample_plugin_folder(journal_folder.parent / "offered")
    prepare_plugin_files(offered, OFFERED_VERSION)
    with sqlite3.connect(journal_folder / "journal.db") as connection:
        connection.execute("UPDATE plugins SET source = ? WHERE name = ?", (str(offered), PLUGIN_NAME))
