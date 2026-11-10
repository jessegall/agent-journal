class AgentScoped:
    """A model or view whose rows belong to one agent. A new row gets the agent that made it or caused it, and
    an agent's queries return only its own rows. Declare EnvironmentScoped with it: the main agent is one per
    environment."""
