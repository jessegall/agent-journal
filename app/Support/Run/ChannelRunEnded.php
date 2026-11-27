<?php

declare(strict_types=1);

namespace App\Support\Run;

use App\Support\Execution\StepOutcome;

/**
 * A supervised run that ended, with the channel its root status still has to go over.
 */
final readonly class ChannelRunEnded
{
    public function __construct(public RunChannel $channel, public StepOutcome $outcome) {}

    /**
     * Notifies the run's end over its channel and sends what is still spooled.
     */
    public function notify(): void
    {
        $this->channel->finish($this->exitCode());
    }

    public function exitCode(): int
    {
        return $this->outcome->status->code;
    }

    public function runId(): string
    {
        return $this->channel->admission->runId;
    }
}
