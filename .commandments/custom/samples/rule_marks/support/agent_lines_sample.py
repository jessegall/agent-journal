from core.modules.drivers.models.agent_line import AgentLine


def saved_line(repository, agent_id, context):
    # @sin architecture_nudges_agent_line_outside_nudger
    return repository.save(AgentLine(agent_id, "see the cart"), context)


def sent_line(nudger, agent_id, nudge, source, context):
    # @righteous architecture_nudges_agent_line_outside_nudger
    return nudger.send(agent_id, nudge, source, context)


def typed_line(launcher, agent_id):
    # @sin architecture_nudges_terminal_line_outside_line_typing
    return launcher.type_line(agent_id, "see the cart")


def queued_line(typing, agent_id):
    # @righteous architecture_nudges_terminal_line_outside_line_typing
    return typing.queue_line(agent_id, "see the cart")
