<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use App\Access\Contracts\CurrentAuthorizer;
use App\Agents\Enums\AccessType;
use App\Assignments\Contracts\AssigneeResolver;
use App\Exceptions\RecordUnavailable;
use App\Records\Contracts\SummaryProvider;
use App\Records\Values\RecordSummary;
use App\Records\Values\SummaryLine;
use App\Support\AssignmentHolder;
use App\Values\ProjectOwner;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Policies\TaskPolicy;
use Illuminate\Database\Eloquent\Collection;

/**
 * Tasks as a short card shows them: the title, the state, and who holds each, read for one task by its id or for a
 * batch in one query with their holders read together.
 */
final readonly class TaskSummaries implements SummaryProvider
{
    public function __construct(private AssigneeResolver $assignees, private CurrentAuthorizer $authorizer) {}

    public function requireReadable(string $id): RecordSummary
    {
        $task = Task::query()->whereKey($id)->firstOr(RecordUnavailable::throwing()->forModel(Task::class, $id));

        return $this->summaries($task->newCollection([$task]))[0];
    }

    public function ownerOf(string $id): ProjectOwner
    {
        return Task::query()
            ->whereKey($id)
            ->firstOr(RecordUnavailable::throwing()->forModel(Task::class, $id))
            ->projectOwner();
    }

    public function visibleSummaries(array $ids): array
    {
        $readable = Task::query()
            ->whereKey($ids)
            ->readExactly(count($ids))
            ->get()
            ->filter(
                fn (Task $task) => $this->authorizer->filterActions(
                    TaskPolicy::class,
                    $task,
                    [AccessType::Read],
                ) !== [],
            );

        return $this->summaries($readable);
    }

    /**
     * @param  Collection<int, Task>  $tasks
     * @return list<RecordSummary>
     */
    private function summaries(Collection $tasks): array
    {
        $holders = $this->assignees->holdersOfRecords(
            array_values($tasks->map(fn (Task $task) => $task->assignmentIdentity())->all()),
        );

        return array_values($tasks->map(function (Task $task) use ($holders) {
            $holder = $holders->forRecord($task->assignmentIdentity())
                ->map(fn (AssignmentHolder $assigned) => [new SummaryLine('holder', $assigned->name)])
                ->getOrElse([]);

            return new RecordSummary($task->id, $task->title, $task->status->standing(), $holder);
        })->all());
    }
}
