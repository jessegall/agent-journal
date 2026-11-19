<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\Actors\Support\ActorStore;
use App\Bus\Contracts\CommandBus;
use App\Processes\Commands\ReconcileLostRuns;
use Illuminate\Console\Command;

/**
 * Marks the runs whose supervisor fell silent as lost; the scheduler runs it every minute.
 */
final class ProcessReconcileCommand extends Command
{
    protected $signature = 'process:reconcile';

    protected $description = 'Mark runs whose supervisor fell silent as lost';

    public function handle(ActorStore $actors, CommandBus $commands): int
    {
        $lost = $actors->actAsSystem('process reconcile', fn (): int => $commands->run(new ReconcileLostRuns()));
        $this->line("{$lost} runs marked lost.");

        return self::SUCCESS;
    }
}
