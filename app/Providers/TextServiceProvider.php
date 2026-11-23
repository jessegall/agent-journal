<?php

declare(strict_types=1);

namespace App\Providers;

use App\Concerns\LoadsCoreRoutes;
use App\Console\Commands\TextReadCommand;
use App\Console\Commands\TextSectionsCommand;
use App\Console\Commands\TextVersionCommand;
use App\Contracts\Reads\TextResolver;
use App\Resolvers\TextRecords;
use Illuminate\Support\ServiceProvider;

/**
 * Core's text: reading any record's versioned text, with its routes for signed agents and signed-in users.
 */
final class TextServiceProvider extends ServiceProvider
{
    use LoadsCoreRoutes;

    public function register(): void
    {
        $this->app->bind(TextResolver::class, TextRecords::class);
    }

    public function boot(): void
    {
        $this->loadCoreRoutes('text/text.php');

        if ($this->app->runningInConsole()) {
            $this->commands([TextVersionCommand::class, TextSectionsCommand::class, TextReadCommand::class]);
        }
    }
}
