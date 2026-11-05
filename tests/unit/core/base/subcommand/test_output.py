import io
import json

from core.base.subcommand.output import Output
from core.base.guard_refusal import GuardRefusal
from core.base.model.tables import Tables
from core.base.page import Page
from core.base.refusal import Refusal
from tests.unit.core.base.model.test_model import Item

ITEM = Item(id=3, version=1, title="Dune")
REFUSAL = GuardRefusal("items.paused-only", Refusal("the item is not paused", "journal item pause 3"), "--skip-guard items.paused-only")


def output_text(json_output: bool, render) -> str:
    stream = io.StringIO()
    render(Output(Tables(), json_output, stream))
    return stream.getvalue()


def test_a_row_prints_its_fields_plain_and_as_json():
    assert output_text(False, lambda output: output.row(ITEM)) == "id: 3\nversion: 1\ntitle: Dune\nstate: open\n"
    assert json.loads(output_text(True, lambda output: output.row(ITEM)))["title"] == "Dune"


def test_a_page_prints_a_line_a_row_and_how_to_reach_the_next_page():
    page: Page[object] = Page([ITEM], 1, 1, 2)
    assert output_text(False, lambda output: output.page(page)) == "3  Dune  open\npage 1, 1 of 2 rows: --page 2 for the next\n"
    assert json.loads(output_text(True, lambda output: output.page(page)))["total"] == 2


def test_a_refusal_prints_its_text_and_as_json_names_the_guard_and_its_flag():
    assert output_text(False, lambda output: output.refusal(REFUSAL)) == f"{REFUSAL.text}\n"
    data = json.loads(output_text(True, lambda output: output.refusal(REFUSAL)))
    assert (data["guard"], data["skip_flag"], data["suggestion"]) == ("items.paused-only", "--skip-guard items.paused-only", "journal item pause 3")
