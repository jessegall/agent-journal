<?php

declare(strict_types=1);

namespace App\Domain\Processes;

use App\Core\Hooks\Inputs\ShellCommandParser;
use Illuminate\Support\ServiceProvider;

/**
 * Supplies the shell command parser the Hooks domain reads every shell command with.
 */
final class ProcessesServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(ShellCommandParser::class, HookCommandFacts::class);
    }
}
