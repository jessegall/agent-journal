<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\CommandRules\CommandReceipt;
use App\Support\ExpiredReceipts;
use Carbon\CarbonImmutable;
use Illuminate\Console\Command;
use Symfony\Component\Console\Attribute\AsCommand;

/**
 * Expires command receipts past their retention and deletes those past their tombstone: the owner runs it from the
 * command line. An expired receipt keeps only its key, so the key stays refused until it is deleted.
 */
#[AsCommand(
    name: 'bus:prune-receipts',
    description: 'Expire command receipts past their retention and remove those past their tombstone',
)]
final class PruneReceiptsCommand extends Command
{
    public function handle(ExpiredReceipts $receipts): int
    {
        $now = CarbonImmutable::now();
        $pruned = CommandReceipt::query()->pastTombstone($now)->delete();
        $expired = $receipts->expirePastRetention($now);

        $this->info("Expired {$expired} and removed {$pruned} command receipts.");

        return self::SUCCESS;
    }
}
