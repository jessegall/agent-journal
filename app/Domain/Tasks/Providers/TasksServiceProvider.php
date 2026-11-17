<?php

declare(strict_types=1);

namespace App\Domain\Tasks\Providers;

use App\Core\Links\Support\LinkTypeRegistry;
use App\Domain\Tasks\Console\AssignedTasksCommand;
use App\Domain\Tasks\Contracts\AssignedTaskReader;
use App\Domain\Tasks\Contracts\TaskAssignmentReader;
use App\Domain\Tasks\Models\Task;
use App\Domain\Tasks\Readers\AssignedTasks;
use App\Domain\Tasks\Readers\TaskAssignmentRecords;
use Illuminate\Support\ServiceProvider;

/**
 * Registers the stable link names of Tasks's own models and binds the reader other domains use to assign tasks.
 */
final class TasksServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->scoped(TaskAssignmentReader::class, TaskAssignmentRecords::class);
        $this->app->scoped(AssignedTaskReader::class, AssignedTasks::class);
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
