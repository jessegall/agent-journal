<?php

declare(strict_types=1);

namespace App\Text\Providers;

use App\Text\Console\TextReadCommand;
use App\Text\Console\TextSectionsCommand;
use App\Text\Console\TextVersionCommand;
use App\Text\Contracts\TextResolver;
use App\Text\Resolvers\TextRecords;
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
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/text.php');

        if ($this->app->runningInConsole()) {
            $this->commands([TextVersionCommand::class, TextSectionsCommand::class, TextReadCommand::class]);
        }
    }
}
