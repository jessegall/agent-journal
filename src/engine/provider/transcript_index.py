from pathlib import Path
from typing import BinaryIO

from engine.row.page import Page
from engine.provider.indexed_transcript import IndexedTranscript
from engine.provider.provider import Provider
from engine.provider.transcript_row import TranscriptRow


class TranscriptIndex:
    """Reads one page of a session's transcript without reading the session again. Per file it keeps, in the
    server's memory, the byte offset and length of each row's line; a read parses only the lines the file grew
    by since the last read, then seeks to the lines of the asked page. A line without its newline yet is still
    being written and waits for the next read. A file that shrank is indexed anew."""

    def __init__(self) -> None:
        self.files: dict[Path, IndexedTranscript] = {}

    def page(self, provider: Provider, path: Path, number: int, size: int) -> Page[TranscriptRow]:
        indexed = self.indexed(provider, path)
        end = max(len(indexed.lines) - (number - 1) * size, 0)
        start = max(end - size, 0)
        with path.open("rb") as transcript:
            rows = tuple(self.row(provider, transcript, indexed.lines[position], position + 1) for position in range(start, end))
        return Page(rows, number, size, len(indexed.lines))

    def older_rows(self, provider: Provider, path: Path, row_id: int, size: int) -> Page[TranscriptRow]:
        indexed = self.indexed(provider, path)
        end = min(max(row_id - 1, 0), len(indexed.lines))
        start = max(end - size, 0)
        with path.open("rb") as transcript:
            rows = tuple(self.row(provider, transcript, indexed.lines[position], position + 1) for position in range(start, end))
        return Page(rows, 1, size, end)

    def indexed(self, provider: Provider, path: Path) -> IndexedTranscript:
        size = path.stat().st_size
        indexed = self.files.get(path)
        if indexed is None or size < indexed.end_offset:
            indexed = self.files[path] = IndexedTranscript()
        with path.open("rb") as transcript:
            transcript.seek(indexed.end_offset)
            grown = transcript.read(size - indexed.end_offset)
        offset = indexed.end_offset
        for line in grown.splitlines(keepends=True):
            if not line.endswith(b"\n"):
                break
            if provider.transcript_row(line.decode(), len(indexed.lines) + 1) is not None:
                indexed.lines.append((offset, len(line)))
            offset += len(line)
        indexed.end_offset = offset
        return indexed

    @staticmethod
    def row(provider: Provider, transcript: BinaryIO, line: tuple[int, int], position: int) -> TranscriptRow:
        transcript.seek(line[0])
        row = provider.transcript_row(transcript.read(line[1]).decode(), position)
        if row is None:
            raise LookupError(f"the transcript line at byte {line[0]} no longer gives row {position}")
        return row
