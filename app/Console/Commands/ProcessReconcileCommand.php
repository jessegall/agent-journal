<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Commands\Runs\ReconcileLostRuns\ReconcileLostRunsCommand;
use App\Enums\CommandEntry;
use App\Support\EntryDispatchers;
use Illuminate\Console\Command;

/**
 * Marks the runs whose supervisor fell silent as lost; the scheduler runs it every minute.
 */
final class ProcessReconcileCommand extends Command
{
    protected $signature = 'process:reconcile';

    protected $description = 'Mark runs whose supervisor fell silent as lost';

    public function handle(EntryDispatchers $dispatchers): int
    {
        $lost = $dispatchers->runAsJournal(
            CommandEntry::HostControl,
            'process reconcile',
            new ReconcileLostRunsCommand(),
        );

        $this->line("{$lost} runs marked lost.");

        return self::SUCCESS;
    }
}
