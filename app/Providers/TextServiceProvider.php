<?php

declare(strict_types=1);

namespace App\Providers;

use App\Actors\Contracts\AgentTexts as AgentTextsContract;
use App\Agents\AgentTexts;
use App\Concerns\LoadsCoreRoutes;
use App\Console\Commands\TextReadCommand;
use App\Console\Commands\TextSectionsCommand;
use App\Console\Commands\TextVersionCommand;
use App\Reads\Contracts\TextResolver as TextResolverContract;
use App\Resolvers\TextResolver;
use Illuminate\Support\ServiceProvider;

/**
 * Core's text: reading any record's versioned text, with its routes for signed agents and signed-in users.
 */
final class TextServiceProvider extends ServiceProvider
{
    use LoadsCoreRoutes;

    public function register(): void
    {
        $this->app->bind(TextResolverContract::class, TextResolver::class);
        $this->app->bind(AgentTextsContract::class, AgentTexts::class);
    }

    public function boot(): void
    {
        $this->loadCoreRoutes('text/text.php');

        if ($this->app->runningInConsole()) {
            $this->commands([TextVersionCommand::class, TextSectionsCommand::class, TextReadCommand::class]);
        }
    }
}
