<?php

declare(strict_types=1);

namespace App\Hooks;

use App\Links\LinkRemoval;
use App\Models\Agents\AgentStackRow;
use App\Models\Drivers\HookCall;
use App\Models\Sessions\StopConditionResult;
use App\Support\ReadBuilder;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;

/**
 * Removes hook calls and closed stacks past their retention, in bounded batches, with their links, and forgets the
 * raw output of old stop results. It keeps active stacks and held ones, and refuses to run when a pruned call could
 * still be retried as new.
 */
final readonly class PruneHookHistory
{
    public function __construct(
        private RetentionPeriods $periods,
        private HookRetryWindow $retryWindow,
        private LinkRemoval $removal,
    ) {}

    public function prune(): PrunedHistory
    {
        $this->periods->assertLongerThan($this->retryWindow);
        $now = CarbonImmutable::now();

        return new PrunedHistory(
            $this->deleteInBatches(
                fn () => HookCall::query()->prunableBefore($now->subDays($this->periods->hookCallDays)),
            ),
            $this->deleteInBatches(
                fn () => AgentStackRow::query()->prunableBefore($now->subDays($this->periods->closedStackDays)),
            ),
            $this->forgetOutputBefore($now->subDays($this->periods->stopOutputDays)),
        );
    }

    /**
     * @param  callable(): ReadBuilder<covariant Model>  $prunable
     */
    private function deleteInBatches(callable $prunable): int
    {
        $deleted = 0;

        do {
            $batch = $prunable()->orderBy('id')->limit($this->periods->batchSize)->get();
            $this->removal->forgetModels(array_values($batch->all()));
            $count = $prunable()->whereKey($batch->modelKeys())->delete();
            $deleted += (int) $count;
        } while ($batch->count() === $this->periods->batchSize);

        return $deleted;
    }

    /**
     * Forgets the raw output of every result recorded before the moment, and answers how many there were; their
     * summaries stay.
     */
    private function forgetOutputBefore(CarbonImmutable $before): int
    {
        return StopConditionResult::query()
            ->withOutput()
            ->createdBefore($before)
            ->update(['output' => null]);
    }
}
