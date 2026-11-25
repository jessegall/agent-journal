<?php

declare(strict_types=1);

namespace Domain\Tasks\Providers;

use App\Contracts\Authorization\ReadEntitlements;
use App\Contracts\Authorization\SystemEntryPolicies;
use App\Contracts\Work\EnvironmentTasks as EnvironmentTasksContract;
use App\Support\Sources\Contracts\DockRegistration;
use App\Values\ReadEntitlement;
use Domain\Tasks\Console\Commands\AssignedTasksCommand;
use Domain\Tasks\Contracts\AssignedTaskResolver as AssignedTaskResolverContract;
use Domain\Tasks\Contracts\TaskAssignmentResolver as TaskAssignmentResolverContract;
use Domain\Tasks\Contracts\TaskDetailsResolver as TaskDetailsResolverContract;
use Domain\Tasks\Contracts\TaskGraphResolver as TaskGraphResolverContract;
use Domain\Tasks\Contracts\TaskHistoryResolver as TaskHistoryResolverContract;
use Domain\Tasks\Contracts\TaskListResolver as TaskListResolverContract;
use Domain\Tasks\Contracts\TaskLogResolver as TaskLogResolverContract;
use Domain\Tasks\Contracts\TaskProgressCounter as TaskProgressCounterContract;
use Domain\Tasks\Contracts\TaskProofResolver as TaskProofResolverContract;
use Domain\Tasks\Contracts\TaskResolver as TaskResolverContract;
use Domain\Tasks\Contracts\TaskWaitResolver as TaskWaitResolverContract;
use Domain\Tasks\Listeners\BindTaskCheckResults;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Policies\TaskPolicy;
use Domain\Tasks\Resolvers\AssignedTaskResolver;
use Domain\Tasks\Resolvers\TaskAssignmentResolver;
use Domain\Tasks\Resolvers\TaskDetailsResolver;
use Domain\Tasks\Resolvers\TaskGraphResolver;
use Domain\Tasks\Resolvers\TaskHistoryResolver;
use Domain\Tasks\Resolvers\TaskListResolver;
use Domain\Tasks\Resolvers\TaskLogResolver;
use Domain\Tasks\Resolvers\TaskProgressCounter;
use Domain\Tasks\Resolvers\TaskProofResolver;
use Domain\Tasks\Resolvers\TaskResolver;
use Domain\Tasks\Resolvers\TaskWaitResolver;
use Domain\Tasks\Support\DockedTask;
use Domain\Tasks\Support\EnvironmentTasks;
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
        $this->app->bind(TaskProgressCounterContract::class, TaskProgressCounter::class);
        $this->app->bind(TaskHistoryResolverContract::class, TaskHistoryResolver::class);
        $this->app->bind(TaskLogResolverContract::class, TaskLogResolver::class);
        $this->app->bind(TaskProofResolverContract::class, TaskProofResolver::class);
        $this->app->bind(TaskWaitResolverContract::class, TaskWaitResolver::class);
        $this->app->bind(TaskGraphResolverContract::class, TaskGraphResolver::class);
        $this->app->bind(TaskResolverContract::class, TaskResolver::class);
        $this->app->scoped(TaskAssignmentResolverContract::class, TaskAssignmentResolver::class);
        $this->app->scoped(AssignedTaskResolverContract::class, AssignedTaskResolver::class);
        $this->app->scoped(EnvironmentTasksContract::class, EnvironmentTasks::class);
        $this->app->scoped(TaskListResolverContract::class, TaskListResolver::class);
        $this->app->scoped(TaskDetailsResolverContract::class, TaskDetailsResolver::class);
    }

    public function boot(
        ReadEntitlements $reads,
        DockRegistration $docks,
        SystemEntryPolicies $systemEntries,
    ): void {
        $readGrant = ReadEntitlement::grant(TaskPolicy::class);

        $docks->offerDockFor($docks->register(Task::linkType(), DockedTask::class, TaskDocking::class));
        $reads->declare('tasks_read', $readGrant);
        $reads->declare('tasks_list', $readGrant);
        $reads->declare('tasks_assigned', $readGrant);
        $systemEntries->allow(BindTaskCheckResults::ENTRY, TaskPolicy::class);
        $this->loadRoutesFrom(dirname(__DIR__, 2).'/routes/agent.php');
        $this->commands([AssignedTasksCommand::class]);

    }
}
