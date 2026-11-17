<?php

declare(strict_types=1);

namespace App\Core\Hooks\Actions;

use App\Core\Hooks\Models\AgentStackRow;
use App\Core\Hooks\Models\HookCall;
use App\Core\Hooks\Support\HookRetryWindow;
use App\Core\Hooks\Support\PrunedHistory;
use App\Core\Hooks\Support\RetentionPeriods;
use App\Core\Links\Models\Link;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Removes hook calls and closed stacks past their retention, in bounded batches, with their links. It keeps active
 * stacks and held ones, and refuses to run when a pruned call could still be retried as new.
 */
final readonly class PruneHookHistory
{
    public function __construct(
        private RetentionPeriods $periods,
        private HookRetryWindow $retryWindow,
    ) {}

    public function prune(): PrunedHistory
    {
        $this->periods->checkLongerThan($this->retryWindow);
        $now = CarbonImmutable::now();

        return new PrunedHistory(
            $this->deleteInBatches(fn () => HookCall::query()->prunableBefore($now->subDays($this->periods->hookCallDays))),
            $this->deleteInBatches(fn () => AgentStackRow::query()->prunableBefore($now->subDays($this->periods->closedStackDays))),
        );
    }

    /**
     * @param  callable(): Builder<covariant Model>  $prunable
     */
    private function deleteInBatches(callable $prunable): int
    {
        $deleted = 0;

        do {
            $batch = $prunable()->orderBy('id')->limit($this->periods->batchSize)->get();
            Link::forgetModels(array_values($batch->all()));
            $count = $prunable()->whereKey($batch->modelKeys())->delete();
            $deleted += (int) $count;
        } while ($batch->count() === $this->periods->batchSize);

        return $deleted;
    }
}
