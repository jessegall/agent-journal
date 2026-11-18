<?php

declare(strict_types=1);

namespace App\Records\Providers;

use App\Records\Console\LinkAddCommand;
use App\Records\Console\LinkRemoveCommand;
use Illuminate\Support\ServiceProvider;

/**
 * Serves the routes and the link:add and link:remove commands that read and link records of every domain.
 */
final class RecordsServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/links.php');

        if ($this->app->runningInConsole()) {
            $this->commands([LinkAddCommand::class, LinkRemoveCommand::class]);
        }
    }
}
