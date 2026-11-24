<?php

declare(strict_types=1);

namespace App\Support\Run;

use App\Support\Execution\ChannelRunEvents;
use App\Support\Execution\RunToSupervise;
use App\Support\Execution\StepOutcome;

/**
 * An admitted run with the signed channel its events go over.
 */
final readonly class RunChannel
{
    public function __construct(public FetchedAdmission $admission, public ChannelRunEvents $events) {}

    public function toSupervise(): RunToSupervise
    {
        return new RunToSupervise($this->events, $this->admission->plan(), $this->admission->context());
    }

    public function ended(StepOutcome $outcome): ChannelRunEnded
    {
        return new ChannelRunEnded($this, $outcome);
    }
}
