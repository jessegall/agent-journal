from engine.enums.work_stop import WorkStop
from core.modules.helpers.effects.job_report_effect import JobReportEffect
from suites.coding.modules.workers.states.merge_job_states import MERGER_TYPE


class MergeJobReportEffect(JobReportEffect):
    """The merger's job report (doc 1310 section 4.4, the merge contract): its allowed stop once every merge it
    started ended hands the merge job in; its profile sends no report message, so the job only closes."""

    agent_types = [MERGER_TYPE]
    report_contract = WorkStop.MERGE_CONTRACT
