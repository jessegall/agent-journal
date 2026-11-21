<?php

declare(strict_types=1);

namespace App\Processes\Listeners;

use App\Contracts\Attributes\InCommandTransaction;
use App\Contracts\Listener;
use App\Processes\Events\OutputChunkCommitted;
use App\Processes\Models\PartRun;
use App\Processes\Support\RunUpdates;

/**
 * A committed chunk changes its part's activity view: the pages that show the run get a live update, at most one a
 * second.
 */
#[InCommandTransaction]
final readonly class RefreshRunActivity implements Listener
{
    public function __construct(private RunUpdates $updates) {}

    public function handle(OutputChunkCommitted $committed): void
    {
        $part = PartRun::query()->whereKey($committed->partRunId)->first();

        if ($part !== null) {
            $this->updates->progressed($part);
        }
    }
}
