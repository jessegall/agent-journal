from dataclasses import replace

import pytest

from core.base.registry.button_line import ButtonLine
from core.base.viewer.choice import Choice
from core.base.viewer.choice_field import ChoiceField
from core.base.viewer.agent_field import AgentField
from core.base.viewer.template_field import TemplateField
from core.base.viewer.text_field import TextField

LINE = ButtonLine("memories", "memory open {row_id}", True)


def test_a_button_line_allows_its_own_line_with_a_row_number():
    assert LINE.allows(["memory", "open", "12"])


def test_a_button_line_refuses_another_command_or_a_filled_word_that_is_no_number():
    assert not LINE.allows(["memory", "delete", "12"]) and not LINE.allows(["memory", "open", "all"])


def test_a_button_line_refuses_a_line_with_words_added_or_left_out():
    assert not LINE.allows(["memory", "open"]) and not LINE.allows(["memory", "open", "12", "--force"])


@pytest.mark.parametrize("value", ["", "two words", "--force", "a=b=c"])
def test_text_blanks_match_one_whole_word(value):
    line = ButtonLine("notes", "note edit {row_id} --text={message}", False, {"message": TextField("message", "Message")})
    assert line.allows(["note", "edit", "1", f"--text={value}"])
    assert not line.allows(["note", "edit", "1", "--text=", value])
    assert not line.allows(["note", "edit", "1", f"--other={value}"])


def test_choices_and_template_numbers_refuse_other_values():
    fields = {"size": ChoiceField("size", "Size", tuple([Choice("small", "Small")])),
              "template": TemplateField("template", "Template", "worker", "critique")}
    line = ButtonLine("notes", "note review {row_id} {size} --template={template}", False, fields)
    assert line.allows(["note", "review", "1", "small", "--template=2"])
    assert not line.allows(["note", "review", "1", "large", "--template=2"])
    assert not line.allows(["note", "review", "1", "small", "--template=unknown"])


def test_a_row_number_can_fill_a_flag_value():
    line = ButtonLine("notes", "note edit --id={row_id}", False)
    assert line.allows(["note", "edit", "--id=12"])
    assert not line.allows(["note", "edit", "--id=other"])


def test_permission_covers_the_whole_template_and_choice_keys():
    choice = ChoiceField("size", "Size", (Choice("small", "Small"), Choice("large", "Large")))
    line = ButtonLine("notes", "note edit {row_id} --size={size}", False, {"size": choice})
    assert line.permission_line != replace(line, template=line.template + " --force").permission_line
    assert line.permission_line != replace(line, fields={"size": replace(choice, choices=(*choice.choices, Choice("medium", "Medium")))}).permission_line
    assert line.permission_line == replace(line, fields={"size": replace(choice, choices=tuple(reversed(choice.choices)))}).permission_line
    assert line.permission_line == replace(line, fields={"size": replace(choice, label="New label")}).permission_line
    assert LINE.permission_line == LINE.template


def test_an_agent_field_takes_only_an_agent_number():
    line = ButtonLine("plans", "plan assign {row_id} --to={agent}", False, {"agent": AgentField("agent", "Agent")})
    assert line.allows(["plan", "assign", "1", "--to=12"])
    assert not line.allows(["plan", "assign", "1", "--to=main"])
