<?php

declare(strict_types=1);

namespace App\Bus\Console;

use App\Bus\Models\CommandReceipt;
use Carbon\CarbonImmutable;
use Illuminate\Console\Command;
use Symfony\Component\Console\Attribute\AsCommand;

/**
 * Deletes command receipts past their retention: the owner runs it from the command line.
 */
#[AsCommand(name: 'bus:prune-receipts', description: 'Remove command receipts older than 30 days')]
final class PruneReceiptsCommand extends Command
{
    private const int RETENTION_DAYS = 30;

    public function handle(): int
    {
        $pruned = CommandReceipt::query()->olderThan(CarbonImmutable::now()->subDays(self::RETENTION_DAYS))->delete();
        $this->info("Removed {$pruned} command receipts.");

        return self::SUCCESS;
    }
}
