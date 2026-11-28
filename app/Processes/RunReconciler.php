<?php

declare(strict_types=1);

namespace App\Processes;

use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Processes\Enums\RunLogicalResult;
use App\Processes\Enums\RunResultSource;
use Carbon\CarbonImmutable;

/**
 * Settles runs whose supervisor fell silent: after a minute without a heartbeat every part not yet ended is lost with
 * an incomplete capture, never inferred a success. A lost attempt records Unknown provisionally, so a late signed
 * result may still correct it.
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
        $runs = ProcessRun::query()->acrossActors()->silentSince($moment)->limit(200)->get();

        foreach ($runs as $run) {
            $parts = $run->parts()->limit(ProcessRun::PART_LIMIT)->get();
            $open = $parts->reject(fn (PartRun $part) => $part->lifecycle->isFinal());

            foreach ($open as $part) {
                $part->lose();
            }

            $run->markLost();
            $this->outcomes->record($run, RunLogicalResult::Unknown, RunResultSource::Provisional);
        }

        return $runs->count();
    }
}
