<?php

declare(strict_types=1);

namespace App\Providers;

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
    public function register(): void
    {
        $this->app->bind(TextResolver::class, TextRecords::class);
    }

    public function boot(): void
    {
        $this->loadRoutesFrom(dirname(__DIR__, 2).'/routes/text/text.php');

        if ($this->app->runningInConsole()) {
            $this->commands([TextVersionCommand::class, TextSectionsCommand::class, TextReadCommand::class]);
        }
    }
}
