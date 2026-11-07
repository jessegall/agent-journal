import json
from pathlib import Path

import pytest

from core.base.provider.program_folders import ProgramFolders
from core.base.provider.transcript_index import TranscriptIndex
from core.base.provider.transcript_row import TranscriptRow
from tests.unit.core.base.samples.program_sample import SampleProgram


class CountingProvider(SampleProgram):
    parsed = 0

    def transcript_row(self, line: str, position: int) -> TranscriptRow | None:
        self.parsed += 1
        return TranscriptRow(position, "user", "user", json.loads(line)["text"])


def transcript_lines(*numbers: int) -> str:
    return "".join(json.dumps({"text": f"line {number}"}) + "\n" for number in numbers)


@pytest.fixture
def provider() -> CountingProvider:
    return CountingProvider(ProgramFolders())


def test_a_second_read_parses_only_the_lines_the_file_grew_by_and_the_lines_it_shows(provider, tmp_path):
    transcript = tmp_path / "s-1.jsonl"
    transcript.write_text(transcript_lines(*range(1, 201)))
    index = TranscriptIndex()
    assert index.page(provider, transcript, 1, 5).total == 200
    provider.parsed = 0
    page = index.page(provider, transcript, 1, 5)
    assert (provider.parsed, page.total) == (5, 200)
    with transcript.open("a") as grown:
        grown.write(transcript_lines(201, 202))
    provider.parsed = 0
    page = index.page(provider, transcript, 1, 5)
    assert (provider.parsed, page.total, [row.id for row in page.rows]) == (2 + 5, 202, [198, 199, 200, 201, 202])


def test_a_shrunk_file_is_indexed_anew(provider, tmp_path):
    transcript = tmp_path / "s-1.jsonl"
    transcript.write_text(transcript_lines(1, 2, 3))
    index = TranscriptIndex()
    index.page(provider, transcript, 1, 5)
    transcript.write_text(transcript_lines(9))
    page = index.page(provider, transcript, 1, 5)
    assert [row.text for row in page.rows] == ["line 9"] and page.total == 1
