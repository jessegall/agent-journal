<?php

declare(strict_types=1);

namespace Domain\Tasks\Providers;

use App\Links\Support\LinkTypeRegistry;
use Domain\Tasks\Console\AssignedTasksCommand;
use Domain\Tasks\Contracts\AssignedTaskReader;
use Domain\Tasks\Contracts\TaskAssignmentReader;
use Domain\Tasks\Contracts\TaskDetailsReader;
use Domain\Tasks\Contracts\TaskListReader;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Readers\AssignedTasks;
use Domain\Tasks\Readers\ListedTasks;
use Domain\Tasks\Readers\TaskAssignmentRecords;
use Domain\Tasks\Readers\TaskDetailRecords;
use Illuminate\Support\ServiceProvider;

/**
 * Registers the stable link names of Tasks's own models and binds the readers other domains use: to assign tasks, to
 * list them and to read one.
 */
final class TasksServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->scoped(TaskAssignmentReader::class, TaskAssignmentRecords::class);
        $this->app->scoped(AssignedTaskReader::class, AssignedTasks::class);
        $this->app->scoped(TaskListReader::class, ListedTasks::class);
        $this->app->scoped(TaskDetailsReader::class, TaskDetailRecords::class);
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
