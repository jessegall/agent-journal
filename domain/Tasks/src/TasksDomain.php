<?php

declare(strict_types=1);

namespace Domain\Tasks;

use App\Bus\Contracts\ProvidesCommands;
use App\Domains\Concerns\HasAssignables;
use App\Domains\Concerns\HasLinkRecords;
use App\Domains\Concerns\HasNumberedModels;
use App\Domains\Concerns\HasStates;
use App\Domains\Contracts\ProvidesAssignables;
use App\Domains\Contracts\ProvidesLinkRecords;
use App\Domains\Contracts\ProvidesMcpTools;
use App\Domains\Contracts\ProvidesStates;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Numbers\Contracts\ProvidesNumberedModels;
use App\Numbers\Support\NumberedModel;
use Domain\Tasks\Api\Events\TaskBlocked;
use Domain\Tasks\Api\Events\TaskCancelled;
use Domain\Tasks\Api\Events\TaskFinished;
use Domain\Tasks\Api\TaskAssignmentCompletion;
use Domain\Tasks\Api\TaskCard;
use Domain\Tasks\Api\TaskFilters;
use Domain\Tasks\Api\TaskList;
use Domain\Tasks\Api\TaskProgress;
use Domain\Tasks\Api\TaskSummary;
use Domain\Tasks\Commands\BlockTask;
use Domain\Tasks\Commands\CancelTask;
use Domain\Tasks\Commands\CreateTask;
use Domain\Tasks\Commands\FinishTask;
use Domain\Tasks\Commands\StartTask;
use Domain\Tasks\Contracts\AssignedTaskReader;
use Domain\Tasks\Contracts\TaskAssignmentReader;
use Domain\Tasks\Contracts\TaskProgressCounter;
use Domain\Tasks\Contracts\TaskReader;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Enums\TaskWorkState;
use Domain\Tasks\Events\TaskStarted;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Mcp\AssignedTasksTool;
use Domain\Tasks\Mcp\HeldTasksOverview;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Readers\TaskAssignments;
use Domain\Tasks\Readers\TaskRecords;
use Domain\Tasks\States\Support\WorkingOnTaskStateFactory;
use Domain\Tasks\States\Support\WorkingOnTaskStateReference;

final class TasksDomain extends Domain implements ProvidesAssignables, ProvidesCommands, ProvidesLinkRecords, ProvidesMcpTools, ProvidesNumberedModels, ProvidesStates
{
    use HasAssignables, HasLinkRecords, HasNumberedModels, HasStates;

    public function description(): string
    {
        return 'A task, its state, its log and what it waits on.';
    }

    /**
     * @return list<class-string>
     */
    public function commands(): array
    {
        return [BlockTask::class, CancelTask::class, CreateTask::class, FinishTask::class, StartTask::class];
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->events(
                TaskStarted::class,
                TaskFinished::class,
                TaskBlocked::class,
                TaskCancelled::class,
            )
            ->contracts(
                TaskProgressCounter::class,
                TaskReader::class,
                TaskAssignmentReader::class,
                AssignedTaskReader::class,
            )
            ->values(
                TaskProgress::class,
                TaskSummary::class,
                TaskAssignmentCompletion::class,
                TaskCard::class,
                TaskFilters::class,
                TaskList::class,
                TaskState::class,
                TaskWorkState::class,
            )
            ->exceptions(TaskMissing::class)
            ->build();
    }

    public function states(): array
    {
        return [WorkingOnTaskStateReference::TYPE_KEY => WorkingOnTaskStateFactory::class];
    }

    public function assignables(): array
    {
        return [Task::LINK_TYPE => TaskAssignments::class];
    }

    public function linkRecords(): array
    {
        return [Task::LINK_TYPE => TaskRecords::class];
    }

    public function numberedModels(): array
    {
        return [NumberedModel::global(Task::class)];
    }

    public function mcpTools(): array
    {
        return [AssignedTasksTool::class];
    }

    public function mcpResources(): array
    {
        return [];
    }

    public function overviewContributions(): array
    {
        return [HeldTasksOverview::class];
    }
}
