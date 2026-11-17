<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Console;

use App\Domain\Hooks\PruneHookHistory;
use Illuminate\Console\Command;

final class PruneHookHistoryCommand extends Command
{
    protected $signature = 'hooks:prune';

    protected $description = 'Remove hook calls and closed stacks past their retention';

    public function handle(PruneHookHistory $pruning): int
    {
        $pruned = $pruning->prune();
        $this->info("Removed {$pruned->hookCalls} hook calls and {$pruned->closedStacks} closed stacks.");

        return self::SUCCESS;
    }
}
