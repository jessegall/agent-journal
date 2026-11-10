from engine.enums.agent_role import AgentRole


def main_agent(query):
    # @sin architecture_agents_main_agent_query_by_hand
    return query.filter(role=AgentRole.MAIN)


def workers(query):
    # @righteous architecture_agents_main_agent_query_by_hand
    return query.filter(role=AgentRole.WORKER)
