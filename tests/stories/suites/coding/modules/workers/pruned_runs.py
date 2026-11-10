from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.context import Context
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.processes.commands.prune_processes.prune_processes import PruneProcesses
from core.modules.processes.models.process import Process
from suites.coding.modules.workers.models.enums.worker_operation_name import WorkerOperationName
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.models.worker_operation import WorkerOperation
from tests.stories.core.modules.processes.process_retention import ProcessLog
from tests.stories.core.modules.processes.support.process_samples import ended_run


def test_pruning_a_run_that_a_worker_operation_and_a_merger_line_name_still_ends_the_newest_run(new_story):
    story = new_story(fixture=ProcessLog)
    first = ended_run(story, "make first", "first\n")
    repository, context = story.container.get(Repository), Context(Actor.core(), story.clock.timestamp(), PruneProcesses())
    repository.save(WorkerOperation(worker_id=story.agent.id, creator_id=story.agent.id, actor_type=ActorType.AGENT, process_id=first.id,
                                    line="journal worker-operation run 1", name=WorkerOperationName.JOB, source_message_id=None,
                                    source_version=0, source_unavailable=False, selecting_actor_id=None, source_origin=""), context)
    repository.save(MergerLine(environment_id=1, text="Worker 2 reports", fallback_source="merger", read_output_id=first.id), context)
    ended_run(story, "make second", "second\n")
    third = ended_run(story, "make third", "third\n")
    story.run_listeners()
    queries = story.container.get(Queries)
    line = queries.query(MergerLine).first()
    story.expect_rows(not queries.query(Process).filter(id=first.id).exists(), queries.query(Process).find(third.id).ended_at is not None,
                      not queries.query(WorkerOperation).filter(process_id=first.id).exists(),
                      line.text == "Worker 2 reports" and line.read_output_id is None)
