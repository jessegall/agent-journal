from core.base.agent_role import AgentRole


def main_agent(query):
    # @sin architecture_agents_RunningMainAgentOneQueryDetector
    return query.filter(role=AgentRole.MAIN)


def workers(query):
    # @righteous architecture_agents_RunningMainAgentOneQueryDetector
    return query.filter(role=AgentRole.WORKER)
