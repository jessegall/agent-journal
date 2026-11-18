<?php

declare(strict_types=1);

namespace App\Processes\Providers;

use App\Links\Support\LinkTypeRegistry;
use App\Processes\Classification\TreeClassifier;
use App\Processes\Console\ExplainCommandTypeCommand;
use App\Processes\Contracts\CommandClassifier;
use App\Processes\Contracts\ShellCommandParser;
use App\Processes\Contracts\ShellSyntax;
use App\Processes\Models\CommandAlias;
use App\Processes\Support\ShellParser;
use App\Processes\Syntax\TreeParser;
use Illuminate\Support\ServiceProvider;

/**
 * Supplies the shell command parser the Hooks domain reads every shell command with, and registers the stable link
 * name of Processes' own model.
 */
final class ProcessesServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(ShellCommandParser::class, ShellParser::class);
        $this->app->singleton(ShellSyntax::class, TreeParser::class);
        $this->app->scoped(CommandClassifier::class, TreeClassifier::class);
    }

    public function boot(LinkTypeRegistry $links): void
    {
        $links->register(['processes.command-alias' => CommandAlias::class]);
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/processes.php');
        $this->commands([ExplainCommandTypeCommand::class]);
    }
}
