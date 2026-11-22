<?php

declare(strict_types=1);

namespace Domain\Tasks\Providers;

use App\Actors\Contracts\ReadEntitlements;
use App\Actors\Values\ReadEntitlement;
use App\Connections\Contracts\EnvironmentTasks;
use App\Docking\Sources\Contracts\DockRegistration;
use App\Links\Support\LinkTypeRegistry;
use Domain\Tasks\Console\AssignedTasksCommand;
use Domain\Tasks\Contracts\AssignedTaskResolver;
use Domain\Tasks\Contracts\TaskAssignmentResolver;
use Domain\Tasks\Contracts\TaskDetailsResolver;
use Domain\Tasks\Contracts\TaskListResolver;
use Domain\Tasks\Contracts\TaskHistoryResolver;
use Domain\Tasks\Contracts\TaskLogResolver;
use Domain\Tasks\Contracts\TaskProofResolver;
use Domain\Tasks\Contracts\TaskReviewTexts;
use Domain\Tasks\Contracts\TaskWaitResolver;
use Domain\Tasks\Contracts\TaskProgressCounter;
use Domain\Tasks\Contracts\TaskResolver;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;
use Domain\Tasks\Policies\TaskPolicy;
use Domain\Tasks\Resolvers\AssignedTasks;
use Domain\Tasks\Resolvers\ListedTasks;
use Domain\Tasks\Resolvers\TaskAssignmentRecords;
use Domain\Tasks\Resolvers\TaskCounts;
use Domain\Tasks\Resolvers\TaskHistoryRecords;
use Domain\Tasks\Resolvers\TaskLogRecords;
use Domain\Tasks\Resolvers\TaskProofRecords;
use Domain\Tasks\Resolvers\TaskReviewTextRecords;
use Domain\Tasks\Resolvers\TaskWaitRecords;
use Domain\Tasks\Resolvers\TaskDetailRecords;
use Domain\Tasks\Resolvers\VisibleTasks;
use Domain\Tasks\Support\DockedTask;
use Domain\Tasks\Support\EnvironmentAssignedTasks;
use Domain\Tasks\Support\TaskDocking;
use Illuminate\Support\ServiceProvider;

/**
 * Registers the stable link names of Tasks's own models and binds the readers other domains use: to assign tasks, to
 * list them and to read one.
 */
final class TasksServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(TaskProgressCounter::class, TaskCounts::class);
        $this->app->bind(TaskHistoryResolver::class, TaskHistoryRecords::class);
        $this->app->bind(TaskLogResolver::class, TaskLogRecords::class);
        $this->app->bind(TaskProofResolver::class, TaskProofRecords::class);
        $this->app->bind(TaskWaitResolver::class, TaskWaitRecords::class);
        $this->app->bind(TaskReviewTexts::class, TaskReviewTextRecords::class);
        $this->app->bind(TaskResolver::class, VisibleTasks::class);
        $this->app->scoped(TaskAssignmentResolver::class, TaskAssignmentRecords::class);
        $this->app->scoped(AssignedTaskResolver::class, AssignedTasks::class);
        $this->app->scoped(EnvironmentTasks::class, EnvironmentAssignedTasks::class);
        $this->app->scoped(TaskListResolver::class, ListedTasks::class);
        $this->app->scoped(TaskDetailsResolver::class, TaskDetailRecords::class);
    }

    public function boot(LinkTypeRegistry $links, ReadEntitlements $reads, DockRegistration $docks): void
    {
        $readGrant = ReadEntitlement::grant(TaskPolicy::class);

        $docks->offerDockFor($docks->register(Task::LINK_TYPE, DockedTask::class, TaskDocking::class));
        $reads->declare('tasks_read', $readGrant);
        $reads->declare('tasks_list', $readGrant);
        $reads->declare('tasks_assigned', $readGrant);
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/agent.php');
        $this->commands([AssignedTasksCommand::class]);

        $links->register([
            Task::LINK_TYPE => Task::class,
            TaskRun::LINK_TYPE => TaskRun::class,
        ]);
    }
}
