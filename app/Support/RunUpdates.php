<?php

declare(strict_types=1);

namespace App\Support;

use App\Events\Processes\RunChanged;
use App\Models\Runs\OutputAssessment;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Models\Runs\ReaderPosition;
use App\Values\PartProjection;
use Illuminate\Contracts\Cache\Repository;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Sends a run's live updates: a part that changes often sends at most one a second, while a part's end or a new assessment is
 * sent at once. Every update sent takes the run's next number.
 */
final readonly class RunUpdates
{
    private const int UPDATE_INTERVAL_SECONDS = 1;

    public function __construct(private Dispatcher $events, private Repository $cache) {}

    /**
     * New output was read: sent unless an update of this run went out within the last second.
     */
    public function progressed(PartRun $part): void
    {
        if ($this->cache->add("process-run-update:{$part->process_run_id}", true, self::UPDATE_INTERVAL_SECONDS)) {
            $this->send($part);
        }
    }

    /**
     * A part ended or got a new assessment: sent at once.
     */
    public function settled(PartRun $part): void
    {
        $this->send($part);
    }

    private function send(PartRun $part): void
    {
        $run = ProcessRun::findForAnyActor($part->process_run_id);
        $position = ReaderPosition::query()->ofPartRun($part->id)->newestUpdatedFirst()->first();
        $assessment = OutputAssessment::findLatestOf($part);

        $projection = new PartProjection(
            $part->id,
            $position === null ? '' : $position->reader_revision_id,
            $assessment === null ? '' : $assessment->id,
            $position === null ? [] : $position->checkpoint->offsets,
        );

        $this->events->dispatch(new RunChanged($run->id, $run->nextUpdate(), [$projection]));
    }
}
