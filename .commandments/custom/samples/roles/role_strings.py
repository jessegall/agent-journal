class Worker:
    key = "worker"


class Agent:
    role: str = ""

    def is_a(self, kind: type) -> bool:
        return self.role == kind.key


def is_worker_by_text(agent: Agent) -> bool:
    # @sin architecture_agents_role_key_compared_as_text
    return agent.role == "worker"


def is_reading_helper(agent: Agent) -> bool:
    # @sin architecture_agents_role_key_compared_as_text
    return agent.role in ("helper", "reviewer")


def is_worker_by_class(agent: Agent) -> bool:
    # @righteous architecture_agents_role_key_compared_as_text
    return agent.is_a(Worker)


def is_named_worker(agent: Agent, name: str) -> bool:
    # @righteous architecture_agents_role_key_compared_as_text
    return name == "worker of the week"


def names_the_worker(fields: dict[str, str], number: int) -> bool:
    # @righteous architecture_agents_role_key_compared_as_text
    return fields["worker"] == str(number)
