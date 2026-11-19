<?php

declare(strict_types=1);

namespace Domain\Tasks\Providers;

use App\Links\Support\LinkTypeRegistry;
use Domain\Tasks\Console\AssignedTasksCommand;
use Domain\Tasks\Contracts\AssignedTaskResolver;
use Domain\Tasks\Contracts\TaskAssignmentResolver;
use Domain\Tasks\Contracts\TaskDetailsResolver;
use Domain\Tasks\Contracts\TaskListResolver;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Resolvers\AssignedTasks;
use Domain\Tasks\Resolvers\ListedTasks;
use Domain\Tasks\Resolvers\TaskAssignmentRecords;
use Domain\Tasks\Resolvers\TaskDetailRecords;
use Illuminate\Support\ServiceProvider;

/**
 * Registers the stable link names of Tasks's own models and binds the readers other domains use: to assign tasks, to
 * list them and to read one.
 */
final class TasksServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->scoped(TaskAssignmentResolver::class, TaskAssignmentRecords::class);
        $this->app->scoped(AssignedTaskResolver::class, AssignedTasks::class);
        $this->app->scoped(TaskListResolver::class, ListedTasks::class);
        $this->app->scoped(TaskDetailsResolver::class, TaskDetailRecords::class);
    }

    public function boot(LinkTypeRegistry $links): void
    {
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/agent.php');
        $this->commands([AssignedTasksCommand::class]);
        $links->register([
            Task::LINK_TYPE => Task::class,
        ]);
    }
}
