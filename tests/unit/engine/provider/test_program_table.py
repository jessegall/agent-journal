import json

from engine.provider.program_table import ProgramTable
from tests.unit.engine.samples.program_sample import SampleProgram


def test_program_table_serializes_the_providers_matcher_fields(monkeypatch):
    monkeypatch.setattr(SampleProgram, "matchers", {"BeforeTool": "tool_name"}, raising=False)
    table = json.loads(ProgramTable([SampleProgram]).text())
    assert table["programs"]["sample"]["matchers"] == {"BeforeTool": "tool_name"}
