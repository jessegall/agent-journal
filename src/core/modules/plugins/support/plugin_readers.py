from pathlib import Path

from engine.command.context import Context
from engine.repository.repository import Repository
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.reader_file import ReaderFile

PLUGIN_READERS_REASON = "a removed plugin takes every reader it brought with it"
PLUGIN_READERS_PUBLISH_REASON = "a plugin ships a handful of readers, each read by its name"

READERS_FOLDER = ".journal-plugin/readers"
SHIPPED_FIELDS = ("type", "commands", "lines_pattern", "script", "progress_pattern", "finished_pattern", "failed_pattern", "summary_pattern", "topic_pattern", "title", "subject")


class PluginReaders:
    """The readers a plugin ships in its folder's .journal-plugin/readers, saved as the project's readers named
    with the plugin, made again like the file when the file changes, a name the project holds as its own left
    as it is, and deleted with the plugin."""

    def __init__(self, readers: ReaderQuery, repository: Repository) -> None:
        self.readers, self.repository = readers, repository

    def publish(self, folder: Path, plugin_name: str, context: Context) -> None:
        plugin_readers = [reader_file.reader(context.actor.id, plugin_name) for reader_file in ReaderFile.found(folder / READERS_FOLDER)]
        stored_readers = {reader.name: reader for reader in self.readers.where_in("name", [reader.name for reader in plugin_readers]).every_row(PLUGIN_READERS_PUBLISH_REASON)}
        for reader in plugin_readers:
            if reader.name not in stored_readers:
                self.repository.save(reader, context)
            elif stored_readers[reader.name].plugin_name == plugin_name:
                self.republish(stored_readers[reader.name], reader, context)

    def republish(self, stored_reader: Reader, plugin_reader: Reader, context: Context) -> None:
        updated_reader = stored_reader.changed(**{field: getattr(plugin_reader, field) for field in SHIPPED_FIELDS})
        if updated_reader != stored_reader:
            self.repository.save(updated_reader, context)

    def remove(self, plugin_name: str, context: Context) -> None:
        for reader in tuple(self.readers.filter(plugin_name=plugin_name).every_row(PLUGIN_READERS_REASON)):
            self.repository.delete(reader, context)
