<?php

declare(strict_types=1);

namespace App\Domain\Processes;

use App\Core\Hooks\Contracts\ShellCommandParser;
use App\Core\Links\Support\LinkTypes;
use App\Domain\Processes\Models\SavedCommand;
use App\Domain\Processes\Support\ShellParser;
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
    }

    public function boot(LinkTypes $links): void
    {
        $links->register(['processes.saved-command' => SavedCommand::class]);
    }
}
