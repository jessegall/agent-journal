<?php

declare(strict_types=1);

namespace App\Domain\Tasks;

use App\Domain\Contracts\Domain;
use App\Domain\Contracts\ProvidesAssignables;
use App\Domain\Contracts\ProvidesStates;
use App\Domain\Tasks\Api\Events\TaskBlocked;
use App\Domain\Tasks\Api\Events\TaskCancelled;
use App\Domain\Tasks\Api\Events\TaskFinished;
use App\Domain\Tasks\Api\TaskAssignmentCompletion;
use App\Domain\Tasks\Api\TaskCard;
use App\Domain\Tasks\Api\TaskFilters;
use App\Domain\Tasks\Api\TaskList;
use App\Domain\Tasks\Api\TaskProgress;
use App\Domain\Tasks\Contracts\AssignedTaskReader;
use App\Domain\Tasks\Contracts\TaskAssignmentReader;
use App\Domain\Tasks\Contracts\TaskProgressCounter;
use App\Domain\Tasks\Contracts\TaskReader;
use App\Domain\Tasks\Enums\TaskState;
use App\Domain\Tasks\Enums\TaskWorkState;
use App\Domain\Tasks\Events\TaskStarted;
use App\Domain\Tasks\Exceptions\TaskMissing;
use App\Domain\Tasks\Models\Task;
use App\Domain\Tasks\Readers\TaskAssignments;
use App\Domain\Tasks\States\Support\WorkingOnTaskStateFactory;
use App\Domain\Tasks\States\Support\WorkingOnTaskStateReference;

final class TasksDomain implements Domain, ProvidesAssignables, ProvidesStates
{
    public function description(): string
    {
        return 'A task, its state, its log and what it waits on.';
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [];
    }

    /**
     * @return list<class-string>
     */
    public function exports(): array
    {
        return [
            TaskStarted::class,
            TaskFinished::class,
            TaskBlocked::class,
            TaskCancelled::class,
            TaskProgressCounter::class,
            TaskProgress::class,
            TaskReader::class,
            TaskMissing::class,
            TaskAssignmentReader::class,
            TaskAssignmentCompletion::class,
            AssignedTaskReader::class,
            TaskCard::class,
            TaskFilters::class,
            TaskList::class,
            TaskState::class,
            TaskWorkState::class,
        ];
    }

    public function states(): array
    {
        return [WorkingOnTaskStateReference::TYPE_KEY => WorkingOnTaskStateFactory::class];
    }

    public function assignables(): array
    {
        return [Task::LINK_TYPE => TaskAssignments::class];
    }
}
