<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Api\Processes\RunPart;
use App\Processes\Contracts\Events\RunEvents;
use App\Processes\Enums\PartEndType;
use App\Processes\Enums\RunEventType;
use App\Values\PartEnd;
use Spatie\LaravelData\Data;

/**
 * One event of a run in the order the host saw it, with the facts its type carries; it is spooled as a line and sent
 * as part of a batch.
 */
final class RunEvent extends Data
{
    public function __construct(
        public readonly int $sequence,
        public readonly RunEventType $type,
        public readonly RunPart|null $part = null,
        public readonly int|null $pid = null,
        public readonly string|null $host = null,
        public readonly PartEndType|null $end = null,
        public readonly int|null $code = null,
        public readonly string|null $reason = null,
        public readonly bool|null $drained = null,
        public readonly string|null $because = null,
    ) {}

    /**
     * Applies the event to where the run's events go; a heartbeat carries no part change.
     */
    public function applyTo(RunEvents $events): void
    {
        $part = $this->part?->key() ?? new PartKey(0, 0, '');

        match ($this->type) {
            RunEventType::PartQueued => $events->queued($part),
            RunEventType::PartStarted => $events->started($part, (int) $this->pid, (string) $this->host),
            RunEventType::PartStartedInside => $events->startedInside($part, (string) $this->host),
            RunEventType::PartEnded => $events->ended($part, $this->partEnd(), $this->drained === true),
            RunEventType::PartSkipped => $events->skipped($part, (string) $this->because),
            RunEventType::PartStartFailed => $events->spawnFailed($part, (string) $this->reason),
            RunEventType::PartStopped => $events->stopped($part, (string) $this->reason),
            RunEventType::PartLost => $events->lost($part),
            RunEventType::RunStopped => $events->runStopped((string) $this->reason),
            RunEventType::RunFinished => $events->runFinished((int) $this->code),
            RunEventType::Heartbeat => null,
        };
    }

    private function partEnd(): PartEnd
    {
        return match ($this->end ?? PartEndType::NotYet) {
            PartEndType::Exited => PartEnd::exited((int) $this->code),
            PartEndType::Signalled => PartEnd::signalled((int) $this->code),
            PartEndType::Unavailable => PartEnd::unavailable((string) $this->reason),
            PartEndType::NotYet => PartEnd::notYet(),
        };
    }
}
