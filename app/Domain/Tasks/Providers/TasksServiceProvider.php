<?php

declare(strict_types=1);

namespace App\Domain\Tasks\Providers;

use App\Core\Links\Support\LinkTypes;
use App\Domain\Tasks\Contracts\TaskAssignmentReader;
use App\Domain\Tasks\Models\Task;
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
    }

    public function boot(LinkTypes $links): void
    {
        $links->register([
            Task::LINK_TYPE => Task::class,
        ]);
    }
}
