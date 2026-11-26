<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Engine\EngineLoop;
use Illuminate\Console\Command;

/**
 * Runs the engine for the life of the process: SIGTERM or SIGINT ends it after the current pass.
 */
final class TickCommand extends Command
{
    protected $signature = 'engine:tick';

    protected $description = 'Run the engine: one pass a second while this process owns the engine lock';

    public function handle(EngineLoop $loop): int
    {
        pcntl_async_signals(true);
        pcntl_signal(SIGTERM, fn () => $loop->stop());
        pcntl_signal(SIGINT, fn () => $loop->stop());

        return $loop->run();
    }
}
