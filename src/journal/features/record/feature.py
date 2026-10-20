from journal.features.feature import Feature
from journal.features.record.listeners.trim_the_record import TrimTheRecord
from journal.support.option import Option


class Record(Feature):
    """The journal's record of what happened: every hook, workflow walk, line said and row changed, kept as a rolling log."""

    KEPT = Option("record.kept", "Keep the record's last", "Entries of the journal's record kept, newest first: every hook, workflow walk, line said and row changed; past this the oldest go, while messages, tasks and every other row of the project stay", 10000, unit="entries")
    name = "record"
    title = "Record"
    help = "The journal keeps a record of every hook, workflow walk, line said and row changed, as a rolling log of its newest entries, trimmed as each is written; the project's own rows, messages among them, are never trimmed."
    fixed = True
    options = (KEPT,)
    listeners = (TrimTheRecord,)
