<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Agents\Models\DriverTurn;
use App\Communication\Enums\PresentationBatchState;
use App\Communication\Models\OutstandingRange;
use App\Communication\Models\PresentationBatch;
use Carbon\CarbonImmutable;
use Illuminate\Database\ConnectionInterface;

/**
 * Settles the presentation attempts that will not be confirmed, each exactly once under its row lock: a batch whose
 * driver turn finished without confirming everything fails at once, and one with no progress for two minutes expires.
 * Each piece it left unconfirmed counts one failure on its own outstanding range, and after five in a row the piece
 * is given up with its reason, so a confirmed beginning never carries the failures of its end.
 */
final readonly class PresentationSweep
{
    public const int ALLOWED_FAILURES = 5;

    private const int PASS_LIMIT = 100;

    public function __construct(private ConnectionInterface $database) {}

    public function sweep(CarbonImmutable $at): void
    {
        $batchIds = PresentationBatch::query()
            ->where('state', PresentationBatchState::Dispatched)
            ->orderBy('dispatched_at')
            ->limit(self::PASS_LIMIT)
            ->pluck('id')
            ->all();

        foreach ($batchIds as $batchId) {
            $this->database->transaction(fn () => $this->settleOne((string) $batchId, $at));
        }
    }

    private function settleOne(string $batchId, CarbonImmutable $at): void
    {
        $batch = PresentationBatch::query()->whereKey($batchId)->lockForUpdate()->first();

        if ($batch === null || $batch->state->isSettled()) {
            return;
        }

        $turnEnded = $batch->driver_turn_id !== null
            && DriverTurn::query()->whereKey($batch->driver_turn_id)->whereNotNull('finished_at')->exists();

        $leaseRanOut = $batch->last_progress_at->addSeconds(PresentationBatches::LEASE_SECONDS)->lessThan($at);

        if (! $turnEnded && ! $leaseRanOut) {
            return;
        }

        $unconfirmed = $batch->ranges()->whereNull('confirmed_at')->with('outstanding')->get();

        if ($unconfirmed->isEmpty()) {
            $batch->settle(PresentationBatchState::Confirmed, $at);

            return;
        }

        $batch->settle($turnEnded ? PresentationBatchState::Failed : PresentationBatchState::Expired, $at);

        foreach ($unconfirmed as $range) {
            $this->countFailure($range->outstanding, $turnEnded ? 'turn ended unconfirmed' : 'no confirmation in time');
        }
    }

    private function countFailure(OutstandingRange $range, string $reason): void
    {
        $range->recordFailure();

        if ($range->consecutive_failures >= self::ALLOWED_FAILURES) {
            $range->exhaust($reason);
        }
    }
}
