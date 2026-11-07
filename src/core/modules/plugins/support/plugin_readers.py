from pathlib import Path

from core.base.command.context import Context
from core.base.repository.repository import Repository
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.reader_file import ReaderFile

READERS_FOLDER = ".journal-plugin/readers"


class PluginReaders:
    """The readers a plugin ships in its folder's .journal-plugin/readers, saved as the project's readers
    named with the plugin, a name the project holds already left as it is, and deleted with the plugin."""

    def __init__(self, readers: ReaderQuery, repository: Repository) -> None:
        self.readers, self.repository = readers, repository

    def publish(self, folder: Path, plugin_name: str, context: Context) -> None:
        for reader_file in ReaderFile.found(folder / READERS_FOLDER):
            if not self.readers.with_name(reader_file.name).exists():
                self.repository.save(reader_file.reader(context.actor.id, plugin_name), context)

    def remove(self, plugin_name: str, context: Context) -> None:
        for reader in tuple(self.readers.filter(plugin_name=plugin_name).all_rows()):
            self.repository.delete(reader, context)
