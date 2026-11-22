<?php

declare(strict_types=1);

namespace App\Processes\Support;

use App\Processes\Enums\RunLogicalResult;
use App\Processes\Enums\RunResultSource;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use Carbon\CarbonImmutable;

/**
 * Settles runs whose supervisor fell silent (doc 21 revision 6, section 53): after a minute without a heartbeat the
 * host had its chance to replay its spool, so every part not yet ended is lost with no status and incomplete capture;
 * nothing is ever inferred as a success. A lost attempt with no trustworthy outcome records Unknown, provisionally,
 * so a genuine late signed result may still correct it.
 */
final readonly class RunReconciler
{
    public const int REPLAY_WINDOW_SECONDS = 60;

    public function __construct(private RunOutcomes $outcomes) {}

    /**
     * @return int the number of runs marked lost
     */
    public function reconcile(): int
    {
        $moment = CarbonImmutable::now()->subSeconds(self::REPLAY_WINDOW_SECONDS);
        $runs = ProcessRun::query()->acrossActors()->silentSince($moment)->readLimit(200)->get();

        foreach ($runs as $run) {
            $parts = $run->parts()->readLimit(500)->get();
            $open = $parts->reject(fn (PartRun $part): bool => $part->lifecycle->isFinal());

            foreach ($open as $part) {
                $part->lose();
            }

            $run->markLost();
            $this->outcomes->record($run, RunLogicalResult::Unknown, RunResultSource::Provisional);
        }

        return $runs->count();
    }
}
