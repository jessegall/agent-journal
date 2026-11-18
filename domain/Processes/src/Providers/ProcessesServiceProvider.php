<?php

declare(strict_types=1);

namespace Domain\Processes\Providers;

use App\Hooks\Contracts\ShellCommandParser;
use App\Links\Support\LinkTypeRegistry;
use Domain\Processes\Models\CommandAlias;
use Domain\Processes\Support\ShellParser;
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

    public function boot(LinkTypeRegistry $links): void
    {
        $links->register(['processes.command-alias' => CommandAlias::class]);
    }
}
