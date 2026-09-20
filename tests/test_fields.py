from engine.record import Record
from resources.shapes import LIST, TEXT, Field
from resources.shapes import check as checked
from resources.types import AgentRow, Plan, Todo, Tool
from tests.conftest import fresh


def test_a_field_read_on_the_class_is_its_own_name_the_one_definition_of_the_key():
    assert (Todo.priority, AgentRow.status, Plan.phases) == ("priority", "status", "phases")


def test_a_field_read_on_a_row_is_the_value_in_its_data():
    t = Todo(n=1, data={"priority": 150})
    assert t.priority == 150


def test_an_undeclared_value_reads_as_the_fields_default():
    t = Todo(n=1, data={"priority": 150})
    assert (t.assigned, Plan().current) == (None, 1)


def test_a_mutable_default_is_made_once_and_kept_in_the_data_so_appending_to_it_sticks():
    p = Plan()
    p.phases.append({"title": "one"})
    assert p.data == {"phases": [{"title": "one"}]}


def test_setting_a_field_writes_its_data():
    p = Plan()
    p.status = "active"
    assert p.data["status"] == "active"


def test_a_field_with_a_spec_is_one_of_the_types_typed_fields_one_without_is_not():
    assert (Tool.fields, "status" in Plan.fields) == ({"entry": "text", "usage": "text"}, False)


def test_field_is_the_one_declaration():
    assert isinstance(vars(Todo)["assigned"], Field) is True


def test_a_setting_read_on_the_class_is_its_key():
    assert (Record.keep, Record.triggers) == ("keep", "triggers")


def test_an_unset_setting_reads_as_its_default():
    record = fresh()
    assert (record.keep, record.cleanup_read_at) == ({}, 0)


def test_setting_it_writes_settings_json_and_reads_back():
    record = fresh()
    record.keep = {"report": 7}
    assert (record.keep, record.setting("keep")) == ({"report": 7}, {"report": 7})


def test_a_list_field_takes_comma_separated_words():
    assert checked("keywords", LIST, "test, tests , suite") == ["test", "tests", "suite"]


def test_a_list_field_still_takes_a_list():
    assert checked("keywords", LIST, ["a", "b"]) == ["a", "b"]


def test_one_word_is_a_list_of_one():
    assert checked("keywords", LIST, "test") == ["test"]


def test_a_text_field_with_commas_stays_one_string():
    assert checked("title", TEXT, "a, b, c") == "a, b, c"
