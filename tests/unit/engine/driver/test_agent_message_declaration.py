from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType
from engine.driver.agent_message import AgentMessage


def test_path_fields_stay_whole_while_free_text_fields_are_shortened():
    declaration = MessageTemplate("sample.paths", AgentMessageType.STEERING, "{name}: {path}", path_fields=["path"])
    path = "/project/" + "long-folder/" * 400 + "SKILL.md"
    assert declaration.agent_message(name="x" * 100, path=path).text == "x" * 79 + "…: " + path
    assert MessageTemplate.restore(declaration.agent_message(name="x" * 100, path=path).stored.json).text == "x" * 79 + "…: " + path


def test_merging_path_fields_keeps_every_path_whole():
    declaration = MessageTemplate("sample.paths", AgentMessageType.STEERING, "read {path}", path_fields=["path"])
    paths = tuple(f"/project/{name}/" + "long-folder/" * 20 + "SKILL.md" for name in ("first", "second", "third"))
    merged = declaration.merged([declaration.agent_message(path=path) for path in paths])
    assert merged.text == "read " + ", ".join(paths)


def test_free_text_still_has_a_field_limit_and_a_line_limit():
    declaration = MessageTemplate("sample.text", AgentMessageType.STEERING, "{name}: {other}")
    assert declaration.field_text("x" * 100) == "x" * 79 + "…"
    assert len(declaration.agent_message(name="x" * 100, other="y" * 100).text) == 120


def test_stored_agent_messages_keep_their_id_field_plural_words_and_context():
    declaration = MessageTemplate("sample.queued", AgentMessageType.NOTICE, "task {task} waits for {worker}",
                                   plural_text="tasks {task} wait for {worker}", id_field="task")
    agent_messages = [MessageTemplate.restore(declaration.agent_message(worker=4, task=task).stored.json) for task in range(40)]
    collapsed = AgentMessage.collapsed(agent_messages)
    assert [agent_message.text for agent_message in collapsed] == ["tasks " + ", ".join(str(task) for task in range(40)) + " wait for 4"]


def test_stored_required_commands_and_plain_text_stay_separate():
    declaration = MessageTemplate("sample.required", AgentMessageType.NOTICE, "read {task}", required_command="journal task show {task}")
    agent_messages = [declaration.agent_message(task=1), declaration.agent_message(task=2), AgentMessage("sample.raw", AgentMessageType.NOTICE, "task 1"), AgentMessage("sample.raw", AgentMessageType.NOTICE, "task 2")]
    stored = [MessageTemplate.restore(agent_message.stored.json) for agent_message in agent_messages]
    assert [agent_message.text for agent_message in AgentMessage.collapsed(stored)] == ["read 1", "read 2", "task 1", "task 2"]


def test_a_declaration_defaults_to_terminal_typing():
    from engine.enums.line_delivery import LineDelivery
    from engine.driver.message_template import MessageTemplate
    from engine.enums.agent_message_type import AgentMessageType
    assert MessageTemplate("sample.line", AgentMessageType.NOTICE, "a line").delivery is LineDelivery.TERMINAL_TYPING
