from engine.database.statement import Statement


class MainMessageTarget:
    def statement(self) -> Statement:
        return Statement("(target_agent_id IS NULL OR target_agent_id IN (SELECT id FROM agents WHERE role = 'main'))")
