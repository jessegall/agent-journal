from core.modules.drivers.models.agent_line import AgentLine


def saved_line(repository, agent_id, context):
    # @sin architecture_messages_agent_line_outside_message_sender
    return repository.save(AgentLine(agent_id, "see the cart"), context)


def sent_line(message_sender, agent_id, agent_message, source, context):
    # @righteous architecture_messages_agent_line_outside_message_sender
    return message_sender.send(agent_id, agent_message, source, context)


def typed_line(launcher, agent_id):
    # @sin architecture_messages_terminal_line_outside_line_typing
    return launcher.type_line(agent_id, "see the cart")


def queued_line(typing, agent_id):
    # @righteous architecture_messages_terminal_line_outside_line_typing
    return typing.queue_line(agent_id, "see the cart")
