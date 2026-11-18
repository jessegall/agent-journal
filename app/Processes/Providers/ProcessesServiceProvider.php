<?php

declare(strict_types=1);

namespace App\Processes\Providers;

use App\Links\Support\LinkTypeRegistry;
use App\Processes\Classification\TreeClassifier;
use App\Processes\Console\ExplainCommandTypeCommand;
use App\Processes\Console\RunProcessCommand;
use App\Processes\Contracts\AliasReader;
use App\Processes\Contracts\CommandClassifier;
use App\Processes\Contracts\OutputRecorder;
use App\Processes\Contracts\ShellCommandParser;
use App\Processes\Contracts\ShellSyntax;
use App\Processes\Models\CommandAlias;
use App\Processes\Models\OutputChunk;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessEvent;
use App\Processes\Models\ProcessRun;
use App\Processes\Rules\JournalClassifier;
use App\Processes\Support\CommandAliases;
use App\Processes\Support\JournalRoutes;
use App\Processes\Support\ProgramClassifiers;
use App\Processes\Support\ShellParser;
use App\Processes\Support\SpoolRecorder;
use App\Processes\Syntax\TreeParser;
use Illuminate\Contracts\Console\Kernel as ConsoleKernel;
use Illuminate\Contracts\Foundation\Application;
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
        $this->app->scoped(AliasReader::class, CommandAliases::class);
        $this->app->scoped(OutputRecorder::class, SpoolRecorder::class);
        $this->app->singleton(JournalRoutes::class, fn (Application $app) => JournalRoutes::fromCommands($app->make(ConsoleKernel::class)->all()));
        $this->app->scoped(ProgramClassifiers::class, fn (Application $app) => new ProgramClassifiers([
            new JournalClassifier($app->make(JournalRoutes::class), $app->basePath('bin/journal')),
        ]));
    }

    public function boot(LinkTypeRegistry $links): void
    {
        $links->register(['processes.command-alias' => CommandAlias::class, 'processes.process-run' => ProcessRun::class, 'processes.part-run' => PartRun::class, 'processes.process-event' => ProcessEvent::class, 'processes.output-chunk' => OutputChunk::class]);
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/processes.php');
        $this->commands([ExplainCommandTypeCommand::class, RunProcessCommand::class]);
    }
}
