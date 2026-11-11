class ContextCompaction:
    def __init__(self, session_agent_id: int) -> None:
        self.session_agent_id = session_agent_id


class ContextCompactionNotice:
    def __init__(self, compaction_id: int) -> None:
        self.compaction_id = compaction_id


class ContextCompactions:
    def request(self, agent_id: int) -> ContextCompaction:
        # @righteous architecture_compactions_row_built_outside_the_compactions
        return ContextCompaction(agent_id)


class CompactionNotices:
    def report(self, compaction_id: int) -> ContextCompactionNotice:
        # @righteous architecture_compactions_notice_built_outside_the_notices
        return ContextCompactionNotice(compaction_id)


class RecordedContextChangeRequests:
    def __init__(self, compactions: ContextCompactions) -> None:
        self.compactions = compactions

    def record(self, agent_id: int) -> None:
        # @righteous architecture_compactions_request_recorded_outside_the_control
        self.compactions.request(agent_id)


class IdleAgentCompactor:
    def __init__(self, compactions: ContextCompactions) -> None:
        self.compactions = compactions

    def compact(self, agent_id: int) -> ContextCompaction:
        # @sin architecture_compactions_request_recorded_outside_the_control
        self.compactions.request(agent_id)
        # @sin architecture_compactions_row_built_outside_the_compactions
        return ContextCompaction(agent_id)

    def report(self, compaction_id: int) -> ContextCompactionNotice:
        # @sin architecture_compactions_notice_built_outside_the_notices
        return ContextCompactionNotice(compaction_id)
