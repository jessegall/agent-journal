<?php

declare(strict_types=1);

namespace App\Domain\Tasks\Providers;

use App\Core\Links\Support\LinkTypes;
use App\Domain\Tasks\Models\Task;
use Illuminate\Support\ServiceProvider;

/**
 * Registers the stable link names of Tasks's own models.
 */
final class TasksServiceProvider extends ServiceProvider
{
    public function boot(LinkTypes $links): void
    {
        $links->register([
            'tasks.task' => Task::class,
        ]);
    }
}
