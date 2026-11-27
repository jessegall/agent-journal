<?php

declare(strict_types=1);

namespace App\Support\Run;

use App\Support\Execution\ChannelRunEvents;
use App\Support\Execution\PlannedRun;
use App\Support\Execution\StepOutcome;

/**
 * An admitted run with the signed channel its events go over.
 */
final readonly class RunChannel
{
    public function __construct(public FetchedAdmission $admission, public ChannelRunEvents $events) {}

    public function toSupervise(): PlannedRun
    {
        return new PlannedRun($this->events, $this->admission->plan(), $this->admission->context());
    }

    public function ended(StepOutcome $outcome): ChannelRunEnded
    {
        return new ChannelRunEnded($this, $outcome);
    }

    /**
     * Reports the run finished with its exit code and sends every spooled event.
     */
    public function finish(int $exitCode): void
    {
        $this->events->runFinished($exitCode);
        $this->events->flush();
    }
}
