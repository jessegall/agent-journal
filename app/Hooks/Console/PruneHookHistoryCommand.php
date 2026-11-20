<?php

declare(strict_types=1);

namespace App\Hooks\Console;

use App\Hooks\Actions\PruneHookHistory;
use Illuminate\Console\Command;

final class PruneHookHistoryCommand extends Command
{
    protected $signature = 'hooks:prune';

    protected $description = 'Remove hook calls and closed stacks past their retention';

    public function handle(PruneHookHistory $pruning): int
    {
        $pruned = $pruning->prune();
        $this->info(sprintf(
            'Removed %d hook calls and %d closed stacks, and the raw output of %d stop results.',
            $pruned->hookCalls,
            $pruned->closedStacks,
            $pruned->stopOutputs,
        ));

        return self::SUCCESS;
    }
}
