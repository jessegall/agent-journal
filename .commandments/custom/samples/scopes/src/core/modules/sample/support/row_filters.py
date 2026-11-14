def filter_agent(query, agent_id):
    # @sin architecture_scopes_agent_filtered_by_hand
    return query.filter(agent_id=agent_id)


def match_agent(agent_id):
    # @sin architecture_scopes_agent_filtered_by_hand
    return Equal("agent_id", agent_id)


def filter_environment(query, environment_id):
    # @sin architecture_scopes_environment_filtered_by_hand
    return query.filter(environment_id=environment_id)


def match_environment(environment_id):
    # @sin architecture_scopes_environment_filtered_by_hand
    return Equal("environment_id", environment_id)


def filter_title(query, title):
    # @righteous architecture_scopes_agent_filtered_by_hand
    # @righteous architecture_scopes_environment_filtered_by_hand
    return query.filter(title=title)


def match_title(title):
    # @righteous architecture_scopes_agent_filtered_by_hand
    # @righteous architecture_scopes_environment_filtered_by_hand
    return Equal("title", title)
