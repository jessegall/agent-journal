from commands.dispatch import shaped
from controllers.types import Todos
from features import load
from features.format import VIEWER
from resources.base import USER
from tests.conftest import fresh


def test_a_row_named_in_text_is_a_chip_in_the_viewer_and_plain_words_everywhere_else():
    load()
    record = fresh()
    todos = Todos(record, actor=USER)
    row = todos.create("see to-do 648", brief="answered message 1712, not `todo 5`")
    viewer = shaped(todos.load(row.n), record, VIEWER)
    assert (viewer["title"], viewer["brief"]) == ("see to-do 648", "answered [[chip message:1712|message 1712]], not `todo 5`"), \
        "the viewer gets each row named in a brief marked as a chip, code left alone; a title stays plain words"
    assert shaped(todos.load(row.n), record)["brief"] == "answered message 1712, not `todo 5`", "the command line gets the plain words"
    todos.update(row.n, brief=viewer["brief"])
    assert todos.load(row.n).brief == "answered message 1712, not `todo 5`", "a marker sent back by the viewer is saved as plain words"
